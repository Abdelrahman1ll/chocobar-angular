import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../app/TokenHelper';
import { MontageResponse } from '../../app/montage/montage.type';

@Injectable({
  providedIn: 'root',
})
export class ProductCustomizationService {
  http = inject(HttpClient);
  constructor(private tokenHelper: TokenHelper) {}

  getMontages() {
    return this.http.get<MontageResponse>(environment.API + '/projects').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  portBasket(data: any) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http.post(environment.API + '/basket',data,{headers}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}