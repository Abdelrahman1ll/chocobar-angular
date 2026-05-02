import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError } from 'rxjs';
import { TokenHelper } from '../../TokenHelper';
import { Delivery } from './delivery.type';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  http = inject(HttpClient);
  constructor(private tokenHelper: TokenHelper) {}
  getDelivery() {
    return this.http.get<Delivery>(environment.API + '/delivery-price').pipe(
      catchError((error) => {
        return error;
      })
    );
  }

  updateDelivery(DeliveryPrice:number) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;
    return this.http
      .post(
        environment.API + '/delivery-price',
        { DeliveryPrice: DeliveryPrice },
        { headers }
      )
      .pipe(
        catchError((error) => {
          return error;
        })
      );
  }
}
