import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment';
import { catchError, throwError } from 'rxjs';
import { MontageResponse } from './montage.type';

@Injectable({
  providedIn: 'root',
})
export class MontageService {
  constructor(private http: HttpClient) {}

  getMontages(search: string = '') {
    const params = new HttpParams().set('search', search);
    return this.http.get<MontageResponse[]>(environment.API + '/projects', { params }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
