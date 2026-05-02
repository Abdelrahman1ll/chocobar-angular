import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from '../components/login/auth.interceptor';
import { MockInterceptor } from './mock.interceptor';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
/*
 * =========================================================================
 * CHANGE LOG: app.config.ts
 * =========================================================================
 * WHY: Registered MockInterceptor in the global HTTP interceptor chain 
 * to handle API failures and return mock data for design presentation.
 * لماذا: تم تسجيل MockInterceptor في سلسلة معالجة الـ HTTP العالمية 
 * للتعامل مع فشل الـ API وإرجاع بيانات وهمية لعرض التصميم.
 * -------------------------------------------------------------------------
 * OLD CODE: 
 * provideHttpClient(withFetch(), withInterceptors([AuthInterceptor]))
 * =========================================================================
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor, MockInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    
    
  ],
};
