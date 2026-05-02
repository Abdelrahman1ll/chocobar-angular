/**
 * =========================================================================
 * CHANGE LOG: mock.interceptor.ts
 * =========================================================================
 * WHY: Created this interceptor to catch failed API requests and serve
 * data from local JSON files. This allows the UI to display fully
 * populated designs even when the backend server is offline.
 * لماذا: تم إنشاء هذا المعالج لالتقاط طلبات الـ API الفاشلة وتقديم
 * بيانات من ملفات JSON المحلية. هذا يسمح للواجهة بعرض تصاميم مكتملة
 * تماماً حتى عندما يكون خادم الباك إند غير متصل.
 * -------------------------------------------------------------------------
 * OLD CODE: None (New logic added to the HTTP pipeline)
 * NEW CODE: Intercepts HttpErrorResponse and returns mock data from MOCK_DATA.
 * =========================================================================
 */
import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { MOCK_DATA } from '../mock-data';

export const MockInterceptor: HttpInterceptorFn = (req, next) => {
  // Allow common methods for mock simulation
  const isAllowedMethod = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let path = req.url;
      try {
        const url = new URL(req.url, window.location.origin);
        path = url.pathname;
      } catch (e) {}

      // Clean path: remove /api prefix
      const cleanPath = path.replace(/^\/api/, '');

      console.log(`MockInterceptor: Intercepting ${req.method} ${cleanPath}`);

      // Try to match paths in MOCK_DATA (GET or Mutation)
      const mockKey = Object.keys(MOCK_DATA).find(
        (key) => cleanPath === key || cleanPath.endsWith(key),
      );

      if (mockKey) {
        console.log(`MockInterceptor: Found mock data for ${mockKey}`);

        // For non-GET requests, we return a 400 Bad Request with a message explaining it's a demo
        const body =
          req.method === 'GET'
            ? MOCK_DATA[mockKey]
            : { 
                status: 'error', 
                message: 'هذا عرض تجريبي فقط - الباك إند غير متصل حالياً' 
              };

        if (req.method === 'GET') {
          return of(new HttpResponse({ body, status: 200 })).pipe(delay(500));
        } else {
          return throwError(() => new HttpErrorResponse({
            error: body,
            status: 400,
            statusText: 'Bad Request'
          })).pipe(delay(500));
        }
      }

      // Generic handler for mutations that aren't explicitly in MOCK_DATA
      if (req.method !== 'GET') {
        console.log(`MockInterceptor: Returning generic demo error for ${req.method} ${cleanPath}`);
        return throwError(() => new HttpErrorResponse({
          error: { 
            status: 'error', 
            message: 'هذا عرض تجريبي فقط - الباك إند غير متصل حالياً' 
          },
          status: 400,
          statusText: 'Bad Request'
        })).pipe(delay(500));
      }

      // If no mock found and it's a GET, proceed with the original error
      return throwError(() => error);
    }),
  );
};
