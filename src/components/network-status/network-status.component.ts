import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastMessageComponent } from '../toast-message/toast-message.component';

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [CommonModule, ToastMessageComponent],
  templateUrl: './network-status.component.html',
  styleUrl: './network-status.component.css',
})
export class NetworkStatusComponent implements OnInit {
  toastType: 'success' | 'error' = 'error';
  toastMessage = '';
  showToast = false;
constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private firstLoadHandled = false;
  private wasOffline = false;

    ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('offline', this.onOffline.bind(this));
      window.addEventListener('online', this.onOnline.bind(this));

      // تأخير عشان ما تظهرش الرسالة عند أول تحميل
      setTimeout(() => {
        this.firstLoadHandled = true;
      }, 2000);
    }
  }
  

  onOffline() {
    if (!this.firstLoadHandled) return;

    this.toastType = 'error';
    this.toastMessage = 'لا يوجد اتصال بالإنترنت';
    this.showToast = true;
    this.wasOffline = true;
  }

  onOnline() {
    if (!this.firstLoadHandled || !this.wasOffline) return;

    this.toastType = 'success';
    this.toastMessage = 'تم الاتصال بالانترنت';
    this.showToast = true;
    this.wasOffline = false;

    // نخفي التوست بعد 3 ثواني
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
