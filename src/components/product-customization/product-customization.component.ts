import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductCustomizationService } from './product-customization.service';
import { BasketService } from '../../app/basket/basket.service';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
@Component({
  selector: 'app-product-customization',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    ToastMessageComponent,
  ],
  templateUrl: './product-customization.component.html',
  styleUrl: './product-customization.component.css',
})
export class ProductCustomizationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() montageId!: string;
  step: 'type' | 'custom' = 'type';
  selectedOption: 'one' | 'two' | 'four' | null = null;
  chocolates: any[] = [];
  addOns: any[] = [];
  montages: any[] = [];
  TwoKindsOfChocolate: boolean = false;
  FourTypesOfChocolate: boolean = false;
  montagePrice: number = 0;
  selectedChocolates: any[] = [];
  selectedAddOns: any[] = [];
  quantity: number = 1;
  chocolateError = false;
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage = '';
  showToast = false;
  constructor(
    private productCustomizationService: ProductCustomizationService,
    private basketService: BasketService
  ) {}

  MontageId(montageId: string) {
    this.productCustomizationService.getMontages().subscribe((data) => {
      const typedData = data as { projects: any[] };
      const foundMontage = typedData.projects.find(
        (m: any) => m._id === montageId
      );
      if (
        foundMontage.TwoKindsOfChocolate !== true &&
        foundMontage.FourTypesOfChocolate !== true
      ) {
        this.step = 'custom'; // تحويل مباشر لمرحلة التخصيص
      }

      this.FourTypesOfChocolate = foundMontage.FourTypesOfChocolate;
      this.TwoKindsOfChocolate = foundMontage.TwoKindsOfChocolate;
      this.montagePrice = foundMontage.price;
      this.montages = foundMontage ? [foundMontage] : [];

      if (Array.isArray(foundMontage.chocolates)) {
        this.chocolates = foundMontage.chocolates.map((c: any) => ({
          _id: c.chocolate?._id,
          name: c.chocolate?.name,
          price: c.price,
        }));
      }

      if (Array.isArray(foundMontage.addOns)) {
        this.addOns = foundMontage.addOns.map((a: any) => ({
          _id: a.addOn?._id,
          name: a.addOn?.name,
          price: a.price,
        }));
      }
    });
  }

  emitClose() {
    this.close.emit();
  }

  selectOption(option: 'one' | 'two' | 'four') {
    this.selectedOption = option;
    this.step = 'custom';
  }
  optionClass(opt: 'one' | 'two' | 'four') {
    return this.selectedOption === opt
      ? 'bg-[#a15d36] text-white'
      : 'bg-white border border-[#a15d36] text-[#4b2e19]';
  }

  getAllowedChocolateCount(): number {
    if (this.chocolates.length === 0) {
      return 0;
    }
    switch (this.selectedOption) {
      case 'one':
        return 1;
      case 'two':
        return 2;
      case 'four':
        return 4;
      default:
        return 1;
    }
  }

  toggleChocolate(choco: any) {
    const index = this.selectedChocolates.indexOf(choco);
    const allowed = this.getAllowedChocolateCount();

    if (index > -1) {
      this.selectedChocolates.splice(index, 1);
      this.chocolateError = false;
    } else {
      if (this.selectedChocolates.length < allowed) {
        this.selectedChocolates.push(choco);
        this.chocolateError = false;
      } else {
        this.chocolateError = true;
      }
    }
  }

  toggleAddOn(addon: any) {
    const index = this.selectedAddOns.indexOf(addon);
    if (index > -1) {
      this.selectedAddOns.splice(index, 1);
    } else {
      this.selectedAddOns.push(addon);
    }
  }

  calculateTotal(): number {
    if (
      this.selectedChocolates?.length === 0 &&
      this.selectedAddOns?.length === 0
    ) {
      return this.montagePrice * this.quantity;
    } else if (this.selectedChocolates?.length === 1) {
      const total = this.montagePrice + this.selectedChocolates[0].price;
      const AddOns = this.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
      return (total + AddOns) * this.quantity;
    } else {
      const Chocolates = this.selectedChocolates.reduce(
        (sum, c) => sum + c.price,
        0
      );
      const AddOns = this.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
      const total = this.montagePrice + Chocolates;
      const percentage = total * 0.1;
      const finalTotal = this.montagePrice + percentage + AddOns;
      return finalTotal * this.quantity;
    }
  }

  submit() {
    const allowed = this.getAllowedChocolateCount();

    if (this.selectedChocolates.length !== allowed) {
      this.chocolateError = true;
      return;
    }

    this.chocolateError = false;
    let userCookie;
    // 1. استخراج الكوكي (كودك تمام هنا):
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/user=([^;]+)/);
      userCookie = match ? match[1] : null;
    }
    let userId: string | null = null;
    try {
      const user = userCookie
        ? JSON.parse(decodeURIComponent(userCookie))
        : null;
      userId = user?._id;
    } catch {
      userId = null;
    }

    if (!userId) {
      this.emitClose();
      return;
    }

    // 2. تجهيز الداتا
    const projectData = {
      Project: this.montageId,
      quantity: this.quantity,
      price: this.calculateTotal(),
      chocolates: this.selectedChocolates.map((c) => ({
        chocolate: c._id,
        price: c.price,
      })),
      addOns: this.selectedAddOns.map((a) => ({
        addOn: a._id,
        price: a.price,
      })),
    };

    const requestData = {
      user: userId,
      Projects: [projectData],
    };

    // 3. الإرسال
    this.PortBasket(requestData);
  }

  ngOnInit() {
    if (this.montageId) {
      this.MontageId(this.montageId);
    }
  }

  PortBasket(data: any) {
    this.productCustomizationService.portBasket(data).subscribe({
      next: () => {
        // ✅ بعد ما نضيف المنتج، نجيب السلة عشان نعرف عدد المنتجات
        this.basketService.getBasket().subscribe({
          next: (res: any) => {
            // ✅ هنا نحط الرسالة بعد نجاح العملية فعليًا
            this.toastType = 'success';
            this.toastMessage = 'تم اضافة المنتج بنجاح';

            this.showToast = true;

            const count = res.basket?.Projects?.length || 0;
            this.basketService.updateBasketCount(count);

            // ✅ إغلاق النافذة بعد نجاح الإضافة
            setTimeout(() => {
              this.emitClose(); // بعد 1.5 ثانية مثلاً
            }, 1000);
          },
          error: (err) => {
            this.toastType = 'error';
            this.toastMessage = 'فشل اضافة المنتج';
            this.showToast = true;
          },
        });
      },
      error: (err) => {
        this.toastType = 'warning';
        this.toastMessage = err.error?.message || 'هذا عرض تجريبي فقط - الباك إند غير متصل حالياً';
        this.showToast = true;
      },
    });
  }
}
