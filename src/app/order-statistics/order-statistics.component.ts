import { Component } from '@angular/core';
import { Order } from '../Admin/all-orders/all-orders.type';
import { AllOrdersService } from '../Admin/all-orders/all-orders.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BackComponent } from '../../components/back/back.component';

@Component({
  selector: 'app-order-statistics',
  imports: [HeaderComponent, FooterComponent, BackComponent],
  templateUrl: './order-statistics.component.html',
  styleUrl: './order-statistics.component.css',
})
export class OrderStatisticsComponent {
  constructor(private allOrdersService: AllOrdersService) {}

  stats = { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
  orders: Order[] = [];
  ngOnInit() {
    this.allOrdersService.getOrders().subscribe({
      next: (data: any) => {
        if (typeof data === 'object' && data !== null && 'order' in data) {
          this.orders = (data as { order: Order[] })?.order;
          this.stats = this.calculateOrderStats(this.orders);
        }
      },
      error: (err) => console.error('Error loading orders:', err),
    });
  }

  calculateOrderStats(orders: Order[]) {
    const now = new Date();

    const dayAgo = new Date(now);
    dayAgo.setDate(dayAgo.getDate() - 1); // مر عليه 24 ساعة

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7); // مر عليه أسبوع

    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1); // مر عليه شهر

    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1); // مر عليه سنة

    const daily = orders.filter((order) => {
      if (!order.createdAt) return false;
      const date = new Date(order.createdAt);
      return date >= dayAgo;
    }).length;

    const weekly = orders.filter((order) => {
      if (!order.createdAt) return false;
      const date = new Date(order.createdAt);
      return date >= weekAgo && date < dayAgo;
    }).length;

    const monthly = orders.filter((order) => {
      if (!order.createdAt) return false;
      const date = new Date(order.createdAt);
      return date >= monthAgo && date < weekAgo;
    }).length;

    const yearly = orders.filter((order) => {
      if (!order.createdAt) return false;
      const date = new Date(order.createdAt);
      return date >= yearAgo && date < monthAgo;
    }).length;

    return { daily, weekly, monthly, yearly };
  }
}
