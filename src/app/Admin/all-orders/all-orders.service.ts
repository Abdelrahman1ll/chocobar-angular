import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../TokenHelper';
import { Order } from './all-orders.type';

@Injectable({ providedIn: 'root' })
export class AllOrdersService {
  http = inject(HttpClient);
  constructor( private tokenHelper: TokenHelper) {}
  
  getOrders() {
    const token = this.tokenHelper.getAccessToken();
     const headers = token
    ? new HttpHeaders({ Authorization: `Bearer ${token}` })
    : undefined;
    return this.http.get<Order[]>(environment.API + '/orders', { headers }).pipe(
      catchError((error) => {
         return throwError(() => error);
      })
    );
  }
}
