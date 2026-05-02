import {
  Component,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ChocolatesService } from './chocolates.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Chocolate } from './chocolates.type';

@Component({
  selector: 'app-chocolates',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './chocolates.component.html',
  styleUrl: './chocolates.component.css',
})
export class ChocolatesComponent {
  @Output() selectedChocolate = new EventEmitter<
    { id: string; price: number }[]
  >();

  constructor(private chocolatesService: ChocolatesService) {}

  showForm = false;
  chocolates: Chocolate[] = [];
  showUpdate = false;

  ngOnInit() {
    this.getChocolates();
  }

  getChocolates() {
    this.chocolatesService.getChocolates().subscribe((data: any) => {
      this.chocolates = data?.typeOfChocolates;
    });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  postchocolates() {
    const chocolateName = this.form.get('name')?.value;
    if (!chocolateName) return;

    this.chocolatesService.postChocolates(chocolateName).subscribe({
      next: () => {
        this.form.reset();
        this.showForm = false;
        this.getChocolates();
      },
      error: () => {},
    });
  }

  selectedChocolates: { [key: string]: number } = {};

  onToggleChocolate(event: Event, id: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedChocolates[id] = 0; // نبدأ بقيمة 0
    } else {
      delete this.selectedChocolates[id];
      this.emitSelected();
    }
  }

  // هنا نستخدم blur بدل ngModelChange لمنع التحديث المبكر
  onPriceBlur(id: string, value: string) {
    const price = parseFloat(value);
    if (!isNaN(price)) {
      this.selectedChocolates[id] = price;
      this.emitSelected();
    }
  }

  emitSelected() {
    const selectedArray = Object.entries(this.selectedChocolates)
      .filter(([id, price]) => id && !isNaN(price))
      .map(([id, price]) => ({ id, price }));

    this.selectedChocolate.emit(selectedArray);
  }

  @Input() resetTrigger: boolean = false;
  @ViewChildren('chk') checkboxes!: QueryList<any>;
  @ViewChildren('priceInput') priceInputs!: QueryList<any>;

  ngOnChanges() {
    if (this.resetTrigger) {
      this.resetChocolates();
    }
  }

  resetUI() {
    this.checkboxes?.forEach(cb => (cb.nativeElement.checked = false));
    this.priceInputs?.forEach(input => (input.nativeElement.value = ''));
  }

  resetChocolates() {
    this.selectedChocolates = {};
    this.emitSelected();
    this.resetUI();
  }

  // إدارة التعديل
  selectedChocolateToEdit: Chocolate | null = null;
  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  openEditModal(chocolate: Chocolate) {
    this.selectedChocolateToEdit = chocolate;
    this.editForm.get('name')?.setValue(chocolate.name);
    this.showUpdate = true;
  }

  closeEditModal() {
    this.showUpdate = false;
    this.selectedChocolateToEdit = null;
    this.editForm.reset();
  }

  updateChocolate() {
    if (this.editForm.invalid || !this.selectedChocolateToEdit) return;

    const updatedName = this.editForm.get('name')?.value;

    this.chocolatesService
      .updateChocolates(this.selectedChocolateToEdit._id, {
        name: updatedName!,
      })
      .subscribe({
        next: () => {
          this.getChocolates();
          this.closeEditModal();
        },
        error: () => {},
      });
  }
}
