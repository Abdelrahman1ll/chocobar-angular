import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../app/TokenHelper';

@Injectable({
  providedIn: 'root',
})

export class PaymentPageService {
  http = inject(HttpClient)
  constructor(private tokenHelper: TokenHelper) {}

  Orders(data: any) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http.post(environment.API + '/orders',data,{headers}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}