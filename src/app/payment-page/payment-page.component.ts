import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentPageService } from './payment-page.service';
import { DeliveryService } from '../Admin/delivery/delivery.service';
import { BasketService } from '../basket/basket.service';
import { HeaderComponent } from '../../components/header/header.component';
import { BackComponent } from '../../components/back/back.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router } from '@angular/router';
import { ToastMessageComponent } from '../../components/toast-message/toast-message.component';
import { BasketResponse } from '../basket/basket.type';
@Component({
  selector: 'app-payment-page',
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BackComponent,
    FooterComponent,
    ToastMessageComponent,
  ],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})
export class PaymentPageComponent {
  isLoading = false;
  showErrors = false;
  paymentMethod = 'cash';
  name = '';
  phone = '';
  address = '';
  deliveryPrice: number = 0; // مثال لسعر التوصيل
  cartTotal = 0; // مثال لإجمالي السلة
  delivery: any[] = [];
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage = '';
  showToast = false;
  get totalPrice() {
    return parseFloat((this.cartTotal + this.deliveryPrice).toFixed(2));
  }

  constructor(
    private paymentPageService: PaymentPageService,
    private DeliveryService: DeliveryService,
    private basketService: BasketService,
    private router: Router
  ) {}

  Basket() {
    this.basketService.getBasket().subscribe((data: BasketResponse) => {
      this.cartTotal = data.basket.totalBasketPrice;
      this.basketService.updateBasketCount(data.basket.Projects.length);
    });
  }

  ngOnInit() {
    this.DeliveryService.getDelivery().subscribe((res: any) => {
      this.delivery = res;
      this.deliveryPrice = this.delivery[0].DeliveryPrice;
    });
    this.Basket();
  }

  onSubmit() {
    this.showErrors = true;
    if (!this.name || !this.phone || !this.address) {
      return;
    }
    if (this.cartTotal === 0) {
      this.toastType = 'error';
      this.toastMessage = 'لم يتم اضافة منتجات للسلة';
      this.showToast = true;

      return;
    }
    this.isLoading = true;
    const data = {
      name: this.name,
      phone: this.phone,
      address: this.address,
    };
    this.paymentPageService.Orders(data).subscribe({
      next: (res: { order?: { name?: string; orderNumber?: number } }) => {
        this.isLoading = false;
        this.name = '';
        this.phone = '';
        this.address = '';
        this.showErrors = false;

        this.router.navigate(['/order-success'], {
          queryParams: {
            name: res?.order?.name || '',
            orderNumber: res?.order?.orderNumber || 0, // غير حسب الـ backend
          },
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.toastType = 'warning';
        this.toastMessage = err.error?.message || 'هذا عرض تجريبي فقط - الباك إند غير متصل حالياً';
        this.showToast = true;
      },
    });
  }
}
