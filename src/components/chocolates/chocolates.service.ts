import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../app/TokenHelper';
import { ChocolateResponse } from './chocolates.type';

@Injectable({
  providedIn: 'root',
})
export class ChocolatesService {
  http = inject(HttpClient);
  constructor(private tokenHelper: TokenHelper) {}
  getChocolates() {
    return this.http.get<ChocolateResponse>(environment.API + '/type-of-chocolate').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  postChocolates(name: string) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http
      .post(environment.API + '/type-of-chocolate', {name: name}, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateChocolates(id: string, body: { name: string }) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http
      .patch(environment.API + `/type-of-chocolate/${id}`,body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
