import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { BackComponent } from '../../../components/back/back.component';
import { AllOrdersService } from './all-orders.service';
import { NgFor, NgIf } from '@angular/common';
import { Order } from './all-orders.type';
import { ProjectsComponent } from '../../../components/projects/projects.component';
import { OrdersNotifierService } from '../../../components/orders-notifier/orders-notifier.service';
@Component({
  selector: 'app-all-orders',
  imports: [
    HeaderComponent,
    FooterComponent,
    BackComponent,
    NgFor,
    ProjectsComponent,
    NgIf,
  ],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css',
})
export class AllOrdersComponent {
  isLoading: boolean = true;
  orders: Order[] = [];

  constructor(
    private allOrdersService: AllOrdersService,
    private notifierService: OrdersNotifierService
  ) {}

  async GetOrders() {
    await this.allOrdersService.getOrders().subscribe({
      next: (data: any) => {
        if (typeof data === 'object' && data !== null && 'order' in data) {
          this.orders = (data as { order: Order[] })?.order;
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit() {
    this.GetOrders();
    this.notifierService.resetUnreadOrders();
  }
  formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0'); // نخليه زي ما هو عشان اليوم يفضل 2 digits
  const month = (date.getMonth() + 1).toString(); // بدون padStart
  const year = date.getFullYear();
  const hour = date.getHours().toString(); // بدون padStart
  const minute = date.getMinutes().toString().padStart(2, '0'); // نسيبها بصفرين عشان الدقيقه تكون واضحه

  return `${hour}:${minute} - ${day}-${month}-${year}`;
}

}
