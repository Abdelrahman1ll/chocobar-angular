import { Component, Output, EventEmitter, Input, QueryList, ViewChildren } from '@angular/core';
import { AddOnsService } from './add-ons.service';
import { NgFor, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddOn } from './add-ons.type';

@Component({
  selector: 'app-add-ons',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './add-ons.component.html',
  styleUrl: './add-ons.component.css',
})
export class AddOnsComponent {
  showForm = false;
  @Output() selectedAddOn = new EventEmitter<{ id: string; price: number }[]>();
  constructor(private addOnsService: AddOnsService) {}
  addOns: AddOn[] = [];
  showUpdate = false;
  GetAddOns() {
    this.addOnsService.getaddOns().subscribe((data: any) => {
      this.addOns = data;
    });
  }
  ngOnInit() {
    this.GetAddOns(); // ✅ استدعاء الإضافات تلقائي عند فتح الكومبوننت
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  postAddOns() {
    const chocolateName = this.form.get('name')?.value;
    if (chocolateName) {
      this.addOnsService.postaddOns(chocolateName).subscribe({
        next: () => {
          this.form.reset();
          this.showForm = false;
          this.GetAddOns();
        },
        error: () => {
        },
      });
    }
  }

  selectedAddOns: { [key: string]: number } = {};

  onToggleAddOn(event: Event, id: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedAddOns[id] = 0; // مبدئيًا صفر أو أي قيمة مؤقتة
    } else {
      delete this.selectedAddOns[id];
    }
    this.emitSelected();
  }

  onPriceChange(event: Event, id: string) {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber;
    if (!isNaN(value)) {
      this.selectedAddOns[id] = value;
      this.emitSelected();
    }
  }

  emitSelected() {
    const selectedArray = Object.entries(this.selectedAddOns).map(
      ([id, price]) => ({ id, price })
    );
    this.selectedAddOn.emit(selectedArray);
  }

  @Input() resetTrigger: boolean = false;
@ViewChildren('chk') checkboxes!: QueryList<any>;
@ViewChildren('priceInput') priceInputs!: QueryList<any>;
  resetUI() {
  // إعادة تعيين جميع عناصر الـ DOM
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const priceInputs = document.querySelectorAll('input[type="number"]');
  
  checkboxes.forEach((cb: any) => cb.checked = false);
  priceInputs.forEach((input: any) => input.value = '');
}
ngOnChanges() {
  if (this.resetTrigger) {
    this.resetAddOns();
  }
}

resetAddOns() {
  this.selectedAddOns = {};
  this.emitSelected(); // نفس الأسلوب لإفراغ البيانات
  this.resetUI();
}










 // لإدارة التعديل
selectedAddOnToEdit: AddOn | null = null;
editForm = new FormGroup({
  name: new FormControl('', Validators.required),
});

// فتح المودال وتعبئة الاسم
openEditModal(chocolate: AddOn) {
  this.selectedAddOnToEdit = chocolate;
  this.editForm.get('name')?.setValue(chocolate.name);
  this.showUpdate = true;
}

// إغلاق المودال
closeEditModal() {
  this.showUpdate = false;
  this.selectedAddOnToEdit = null;
  this.editForm.reset();
}

// إرسال التعديل للسيرفر
updateAddOn() {
  if (this.editForm.invalid || !this.selectedAddOnToEdit) return;

  const updatedName = this.editForm.get('name')?.value;

  this.addOnsService.updateAddOns(this.selectedAddOnToEdit._id, { name: updatedName! })
    .subscribe({
      next: () => {
        this.GetAddOns(); // تحديث القائمة
        this.closeEditModal(); // إغلاق المودال
      },
      error: () => {},
    });
}





}
