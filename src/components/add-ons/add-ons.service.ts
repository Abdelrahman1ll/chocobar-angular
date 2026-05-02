import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../app/TokenHelper';
import { AddOn } from './add-ons.type';

@Injectable({
  providedIn: 'root',
})
export class AddOnsService {
  http = inject(HttpClient);
  constructor(private tokenHelper: TokenHelper) {}
  getaddOns() {
    return this.http.get<AddOn[]>(environment.API + '/add-ons').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  postaddOns(name: string) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http
      .post(environment.API + '/add-ons', { name: name }, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateAddOns(id: string, body: { name: string }) {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;
    return this.http
      .patch(environment.API + `/add-ons/${id}`, body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
