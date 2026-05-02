import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../app/TokenHelper';
import { BasketResponse } from './basket.type';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  http = inject(HttpClient);
  constructor(private tokenHelper: TokenHelper) {}

private basketCountSubject = new BehaviorSubject<number>(0);
  basketCount$ = this.basketCountSubject.asObservable();

  updateBasketCount(count: number) {
    this.basketCountSubject.next(count);
  }


  getBasket() {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http
      .get<BasketResponse>(`${environment.API}/basket`, {
        headers,
        withCredentials: true
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deleteBasket(id: string) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http
      .delete(`${environment.API}/basket/${id}`, {
        headers,
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
