import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrdersNotifierService {
  private unreadKey = 'unreadOrders';
  private previousKey = 'previousOrderCount';

  getUnreadOrders(): number {
    return parseInt(localStorage.getItem(this.unreadKey) || '0');
  }

  setUnreadOrders(count: number) {
    localStorage.setItem(this.unreadKey, count.toString());
  }

  resetUnreadOrders() {
    localStorage.setItem(this.unreadKey, '0');
  }

  getPreviousOrderCount(): number {
    return parseInt(localStorage.getItem(this.previousKey) || '0');
  }

  setPreviousOrderCount(count: number) {
    localStorage.setItem(this.previousKey, count.toString());
  }
}
