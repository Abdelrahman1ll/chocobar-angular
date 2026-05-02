import { Component, OnInit } from '@angular/core';
import { AllOrdersService } from '../../app/Admin/all-orders/all-orders.service';
import { NgIf } from '@angular/common';
import { OrdersNotifierService } from './orders-notifier.service';

@Component({
  selector: 'app-orders-notifier',
  standalone: true,
  imports: [NgIf],
  templateUrl: './orders-notifier.component.html',
  styleUrls: ['./orders-notifier.component.css'],
})
export class OrdersNotifierComponent implements OnInit {
  unreadOrders: number = 0;

  constructor(
    private allOrdersService: AllOrdersService,
    private notifierService: OrdersNotifierService
  ) {}

  ngOnInit() {
    // تحميل القيمة المخزنة
    this.unreadOrders = this.notifierService.getUnreadOrders();

    setInterval(() => this.checkForNewOrders(), 10000);
  }

  checkForNewOrders() {
    this.allOrdersService.getOrders().subscribe({
      next: (res: any) => {
        const currentCount = res?.count || 0;
        const previousCount = this.notifierService.getPreviousOrderCount();
        const newOrders =
          currentCount > previousCount ? currentCount - previousCount : 0;
      
        if (newOrders > 0) {
          this.unreadOrders += newOrders;
          this.notifierService.setUnreadOrders(this.unreadOrders);
          this.Audios();
        }

        this.notifierService.setPreviousOrderCount(currentCount);
      },
      error: (err) => {},
    });
  }

  Audios() {
  const audio = new Audio();
  audio.src = '/piece-of-cake-611.ogg';
  audio.load();
  audio.play();
  
}


  // هذه الدالة يمكنك استدعاؤها من كمبوننت آخر إذا حبيت
  resetUnreadOrders() {
    this.unreadOrders = 0;
    this.notifierService.setPreviousOrderCount(0);
  }
}
