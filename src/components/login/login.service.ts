import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { AuthType, SendCodeType } from './login.type';
import { environment } from '../../../environment';
@Injectable({ providedIn: 'root' })
export class LoginService {
  http = inject(HttpClient);

  loginCode(name: string, phone: string) {
    return this.http
      .post<SendCodeType>(
        `${environment.API}/auth/send-code`,
        {
          name: name,
          phone: phone,
        },
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  verifyCode(phone: string, otp: string) {
    return this.http
      .post<AuthType>(
        `${environment.API}/auth/verify-code`,
        { phone: phone, otp: otp },
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
