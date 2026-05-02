import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenHelper {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  getAccessToken(): string | null {
    if (this.isBrowser) {
      const match = document.cookie.match(/accessToken=([^;]+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (this.isBrowser) {
      const match = document.cookie.match(/refreshToken=([^;]+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  getUser(): string | null {
    if (this.isBrowser) {
      const match = document.cookie.match(/user=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    }
    return null;
  }
}
