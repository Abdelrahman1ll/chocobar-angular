import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { BackComponent } from '../../../components/back/back.component';
import { AddMontageService } from './add-montage.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { ChocolatesComponent } from '../../../components/chocolates/chocolates.component';
import { AddOnsComponent } from '../../../components/add-ons/add-ons.component';
import { ToastMessageComponent } from '../../../components/toast-message/toast-message.component';
@Component({
  selector: 'app-add-montage',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    BackComponent,
    ReactiveFormsModule,
    CommonModule,
    ChocolatesComponent,
    NgIf,
    NgClass,
    AddOnsComponent,
    ToastMessageComponent,
  ],
  templateUrl: './add-montage.component.html',
  styleUrl: './add-montage.component.css',
})
export class AddMontageComponent {
  form: FormGroup;
  imageFile: File | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  isLoding = false;
  resetChocolates = false;
  resetAddOns = false;
  constructor(
    private fb: FormBuilder,
    private addMontageService: AddMontageService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      TwoKindsOfChocolate: [false],
      FourTypesOfChocolate: [false],
      chocolates: [[]], // لازم تضيف القيم بشكل يدوي من الكومبوننت
      addOns: [[]],
      image: [null, Validators.required],
    });
  }
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage = '';
  showToast = false;

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      await this.form.patchValue({ image: file });
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // ✅ ضروري
      return;
    }
    this.isLoding = true;
    const formData = this.form.value;

    formData.image = this.imageFile;
    this.addMontageService.addMontage(formData).subscribe({
      next: async (res) => {
        this.form.reset({
          image: null,
          chocolates: [],
          addOns: [],
          TwoKindsOfChocolate: false,
          FourTypesOfChocolate: false,
          price: null,
          title: '',
        });
        this.resetChocolates = true;
        this.resetAddOns = true;

        setTimeout(() => {
          this.resetChocolates = false;
          this.resetAddOns = false;
        }, 300);

        this.imageFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.isLoding = false;
        this.toastType = 'success';
        this.toastMessage = 'تم الإضافة بنجاح';
        this.showToast = true;
      },
      error: (err) => {
        this.isLoding = false;
        this.toastType = 'error';
        this.toastMessage = 'فشل الإضافة';
        this.showToast = true;
      },
    });
  }

  handleSelectedChocolates(chocolates: { id: string; price: number }[]) {
    const isValid = chocolates.every(
      (ch) =>
        ch.id !== null &&
        ch.id !== undefined &&
        ch.price !== null &&
        ch.price !== undefined
    );

    if (!isValid) {
      return;
    }

    this.form.patchValue({
      chocolates: chocolates.map((c) => ({
        chocolate: c.id,
        price: c.price,
      })),
    });
  }

  handleSelectedAddOns(addOns: { id: string; price: number }[]) {
    const isValid = addOns.every(
      (ch) =>
        ch.id !== null &&
        ch.id !== undefined &&
        ch.price !== null &&
        ch.price !== undefined
    );

    if (!isValid) {
      return;
    }

    this.form.patchValue({
      addOns: addOns.map((a) => ({
        addOn: a.id,
        price: a.price,
      })),
    });
  }
}
