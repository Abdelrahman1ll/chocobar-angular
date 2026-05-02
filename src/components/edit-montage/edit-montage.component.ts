import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ChocolatesService } from '../chocolates/chocolates.service';
import { NgFor, NgIf } from '@angular/common';
import { AddOnsService } from '../add-ons/add-ons.service';
import { EditMontageService } from './edit-montage.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { MontageComponent } from '../../app/montage/montage.component';

@Component({
  selector: 'app-edit-montage',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    NgIf,
    ToastMessageComponent,
  ],
  templateUrl: './edit-montage.component.html',
  styleUrls: [],
})
export class EditMontageComponent implements OnInit {
  [x: string]: any;
  addOnPriceInput: any;
  Number(value: any): number {
    return Number(value);
  }

  imageFile: any;
  @Input() montageId!: string;

  ModifyProduct = false;
  @Output() close = new EventEmitter<void>();

  editForm: FormGroup;
  chocolates: any[] = [];
  addOns: any[] = [];
  Montages?: any = {};
  isLoding = false;
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage = '';
  showToast = false;
  constructor(
    private fb: FormBuilder,
    private chocolatesService: ChocolatesService,
    private addOnsService: AddOnsService,
    private editMontageService: EditMontageService,
    private MontageComponent: MontageComponent
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      TwoKindsOfChocolate: [false],
      FourTypesOfChocolate: [false],
      chocolates: [[]],
      addOns: [[]],
      image: [null],
    });
  }

  closeModal() {
    this.close.emit();
  }

  async getChocolates() {
    await this.chocolatesService.getChocolates().subscribe((data: any) => {
      this.chocolates = data.typeOfChocolates;
    });
  }

  async GetAddOns() {
    await this.addOnsService.getaddOns().subscribe((data: any) => {
      this.addOns = data;
    });
  }

  async getIdMontages(id: string) {
    await this.editMontageService.getIDMontages(id).subscribe((data: any) => {
      this.Montages = data.project;
      // تحديث قيم الفورم بالبيانات المجلبة
      this.populateForm();
    });
  }

  // دالة لتعبئة الفورم بالبيانات
  async populateForm() {
    if (this.Montages) {
      const selectedChocolates = (this.Montages.chocolates || [])
        .filter((item: any) => item.chocolate)
        .map((item: any) => ({
          _id: item.chocolate._id,
          name: item.chocolate.name,
          price: item.price,
        }));

      const selectedAddOns = (this.Montages.addOns || [])
        .filter((item: any) => item.addOn)
        .map((item: any) => ({
          _id: item.addOn._id,
          name: item.addOn.name,
          price: item.price,
        }));

      this.editForm.patchValue({
        title: this.Montages.title || '',
        price: this.Montages.price || null,
        TwoKindsOfChocolate: this.Montages.TwoKindsOfChocolate || false,
        FourTypesOfChocolate: this.Montages.FourTypesOfChocolate || false,
        chocolates: selectedChocolates,
        addOns: selectedAddOns,
      });
    }
  }

  // Chocolates
  isChocolateSelected(id: string): boolean {
    return this.editForm.value.chocolates.some((c: any) => c._id === id);
  }

  getChocolatePrice(id: string): number {
    const item = this.editForm.value.chocolates.find((c: any) => c._id === id);
    return item ? item.price : 0;
  }

  onChocolateChange(chocolate: any, isSelected: boolean, price: number) {
    const chocolates = [...this.editForm.value.chocolates];
    const index = chocolates.findIndex((c: any) => c._id === chocolate._id);

    if (isSelected) {
      if (index > -1) {
        chocolates[index].price = price;
      } else {
        chocolates.push({ _id: chocolate._id, name: chocolate.name, price });
      }
    } else {
      if (index > -1) chocolates.splice(index, 1);
    }

    this.editForm.patchValue({ chocolates });
  }

  // AddOns
  isAddOnSelected(id: string): boolean {
    return this.editForm.value.addOns.some((a: any) => a._id === id);
  }

  getAddOnPrice(id: string): number {
    const item = this.editForm.value.addOns.find((a: any) => a._id === id);
    return item ? item.price : 0;
  }

  onAddOnChange(addOn: any, isSelected: boolean, price: number) {
    const addOns = [...this.editForm.value.addOns];
    const index = addOns.findIndex((c: any) => c._id === addOn._id);

    if (isSelected) {
      if (index > -1) {
        addOns[index].price = price;
      } else {
        addOns.push({ _id: addOn._id, name: addOn.name, price });
      }
    } else {
      if (index > -1) addOns.splice(index, 1);
    }

    this.editForm.patchValue({ addOns });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.editForm.patchValue({ image: file });
    }
  }

  async onSubmit() {
    this.isLoding = true;
    const formValue = this.editForm.value;
    const id = this.montageId;

    // إعداد الشيكولاتات - لو فاضية خذ الأصلية
    let validChocolates = [];
    if (formValue.chocolates && formValue.chocolates.length > 0) {
      validChocolates = formValue.chocolates.map((c: any) => ({
        chocolate: c._id,
        price: c.price,
      }));
    }

    // إعداد الإضافات - لو فاضية خذ الأصلية
    let validAddOns = [];
    if (formValue.addOns && formValue.addOns.length > 0) {
      validAddOns = formValue.addOns.map((a: any) => ({
        addOn: a._id,
        price: a.price,
      }));
    }

    const dataToSend = {
      title: formValue.title,
      price: formValue.price,
      image: this.imageFile,
      TwoKindsOfChocolate: formValue.TwoKindsOfChocolate,
      FourTypesOfChocolate: formValue.FourTypesOfChocolate,
      chocolates: validChocolates,
      addOns: validAddOns,
    };

    await this.editMontageService.PatchMontages(dataToSend, id).subscribe({
      next: () => {
        this.editForm.reset({
          image: null,
          chocolates: [],
          addOns: [],
          TwoKindsOfChocolate: false,
          FourTypesOfChocolate: false,
          price: null,
          title: '',
        });
        this.isLoding = false;
        this.toastType = 'success';
        this.toastMessage = 'تم التحديث بنجاح';
        this.showToast = true;
        setTimeout(() => {
          this.closeModal(); // بعد 1.5 ثانية مثلاً
        }, 1000);
        this.MontageComponent.loadMontages();
      },
      error: () => {
        this.isLoding = false;
        this.toastType = 'error';
        this.toastMessage = 'فشل التحديث';
        this.showToast = true;
      },
    });
  }

  async ngOnInit() {
    await this.getChocolates();
    await this.GetAddOns();
    if (this.montageId) {
      await this.getIdMontages(this.montageId);
    }
  }
}
