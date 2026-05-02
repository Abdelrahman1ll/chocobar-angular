import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { NgClass, NgIf } from '@angular/common';
import { BasketService } from '../../app/basket/basket.service';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { OrdersNotifierComponent } from '../orders-notifier/orders-notifier.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    LoginComponent,
    NgIf,
    FormsModule,
    OrdersNotifierComponent,
    NgClass,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  basketCount: number = 0;
  search: string = '';
  private searchChanged = new Subject<string>();

  showLogin = false;
  dropdownOpen = false;
  user: any = null;

  constructor(private basketService: BasketService, private router: Router) {}

  async ngOnInit() {
    const userCookie = this.getCookie('user');
    if (userCookie) {
      this.user = JSON.parse(decodeURIComponent(userCookie));
    }

    await this.basketService?.basketCount$?.subscribe((count) => {
      this.basketCount = count;
    });

    await this.basketService.getBasket().subscribe((res: any) => {
      const count = res.basket?.Projects?.length || 0;
      this.basketService?.updateBasketCount(count);
    });

    await this.searchChanged.pipe(debounceTime(300)).subscribe((term) => {
      this.router.navigate(['/montage'], {
        queryParams: { search: term || null },
        queryParamsHandling: 'merge',
      });
    });
  }

  async onSearchChange() {
    if (this.router.url.includes('/montage')) {
      await this.searchChanged.next(this.search); // يعمل فلترة فقط لو هو بالفعل في صفحة المنتجات
    }
  }
  async onSearchFocus() {
    // لو المستخدم مش في صفحة المنتجات، ودّيه عليها
    if (!this.router.url.includes('/montage')) {
      await this.router.navigate(['/montage'], {
        queryParams: this.search ? { search: this.search } : {},
        queryParamsHandling: 'merge',
      });
    }
  }

  getCookie(name: string) {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    window.location.reload();
  }

  showMobileSearch: boolean = false;

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }
}
