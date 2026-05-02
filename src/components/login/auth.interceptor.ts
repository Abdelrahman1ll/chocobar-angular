import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenHelper } from '../../app/TokenHelper';

// دالة لحذف الكوكيز
function clearAuthCookies() {
  if (typeof document !== 'undefined') {
    ['accessToken', 'refreshToken', 'user'].forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });
  }
}

// دالة لحفظ كوكي جديد
function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const tokenHelper = inject(TokenHelper);

  const accessToken = tokenHelper.getAccessToken();

  const clonedReq = accessToken
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const refreshToken = tokenHelper.getRefreshToken();

        // إذا لا يوجد refresh token → لا تحاول التحديث
        if (!refreshToken) {
          clearAuthCookies(); // حذف الكوكيز احتياطيًا
          return throwError(() => error);
        }

        return http
          .post<{ accessToken: string; refreshToken?: string }>(
            `${environment.API}/auth/refresh-token`,
            { refreshToken }
          )
          .pipe(
            switchMap((res) => {
              // خزّن accessToken لمدة ساعة
              setCookie('accessToken', res.accessToken, 60 * 60);

              // لو فيه refreshToken جديد خزّنه لمدة 9 شهور
              if (res.refreshToken) {
                setCookie('refreshToken', res.refreshToken, 60 * 60 * 24 * 180);
              }

              // أعِد إرسال الطلب الأصلي بعد التحديث
              const retryReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${res.accessToken}`
                ),
              });

              return next(retryReq);
            }),
            catchError((refreshError) => {
              const message =
                refreshError?.error?.message || refreshError?.message || '';

              if (
                message.includes('jwt expired') ||
                message.includes('invalid')
              ) {
                clearAuthCookies(); // التوكن منتهي تمامًا
              }

              return throwError(() => refreshError);
            })
          );
      }

      // إذا لم يكن خطأ 401
      return throwError(() => error);
    })
  );
};
