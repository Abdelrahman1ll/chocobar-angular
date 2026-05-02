import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  selector: 'app-order-success',
  imports: [RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css',
})
export class OrderSuccessComponent {
  @Input() customerName: string = '';
  @Input() orderNumber: number = 0;
  @Input() storeNumber: string = '01065798558';
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.customerName = params['name'] || '';
      this.orderNumber = params['orderNumber'] || '';
    });
  }
  get greeting(): string {
    const isArabic = /[\u0600-\u06FF]/.test(this.customerName);
    return isArabic
      ? `شكرًا لك يا ${this.customerName} على طلبك`
      : `Thank you, ${this.customerName}, for your order`;
  }
}
