import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkStatusComponent } from '../components/network-status/network-status.component';
import { inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenHelper } from './TokenHelper';
import adminLogin from '../mock-data/admin-login.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NetworkStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
/*
 * =========================================================================
 * CHANGE LOG: app.component.ts
 * =========================================================================
 * WHY: Added auto-login logic to ensure the user is immediately 
 * authenticated as a "Super Admin" upon opening the app. This unlocks 
 * all restricted admin pages for presentation purposes.
 * لماذا: تم إضافة منطق تسجيل الدخول التلقائي لضمان مصادقة المستخدم 
 * فوراً كـ "Super Admin" عند فتح التطبيق. هذا يفتح جميع صفحات 
 * المسؤول المقيدة لأغراض العرض.
 * -------------------------------------------------------------------------
 * OLD CODE:
 * export class AppComponent {} (Empty class)
 * =========================================================================
 */
export class AppComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private tokenHelper = inject(TokenHelper);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAutoLogin();
    }
  }

  private checkAutoLogin() {
    const existingToken = this.tokenHelper.getAccessToken();
    const userString = this.tokenHelper.getUser();
    const user = userString ? JSON.parse(userString) : null;

    if (!existingToken || !user?.isAdmin) {
      console.log('Mock: Auto-logging in as Admin (Highest Authority)...');
      this.setCookie('accessToken', adminLogin.accessToken, 60 * 60);
      this.setCookie('refreshToken', adminLogin.refreshToken, 60 * 60 * 24 * 180);
      this.setCookie('user', encodeURIComponent(JSON.stringify(adminLogin.user)), 60 * 60 * 24);
      
      // Reload to ensure all services pick up the new tokens
      window.location.reload();
    }
  }

  private setCookie(name: string, value: string, maxAge: number) {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}
