import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../app/TokenHelper';
import { MontageResponse } from '../../app/montage/montage.type';

@Injectable({
  providedIn: 'root',
})
export class EditMontageService {
  http = inject(HttpClient);
  constructor(private tokenHelper: TokenHelper) {}

  getIDMontages(id:string) {
    return this.http.get<MontageResponse>(environment.API + `/projects/${id}`).pipe(
      catchError((error) => {
       return throwError(() => error);
      })
    );
  }
  PatchMontages(data: any,id:string) {
    const token = this.tokenHelper.getAccessToken();
    const formData = new FormData();

    // البيانات النصية
    formData.append('title', data.title);
    formData.append('price', data.price);
    // أبعت القيمتين دايمًا
formData.append('TwoKindsOfChocolate', String(!!data.TwoKindsOfChocolate));
formData.append('FourTypesOfChocolate', String(!!data.FourTypesOfChocolate));

    // تحويل الـ Arrays إلى JSON Strings
   if (data.chocolates && data.chocolates.length > 0) {
      formData.append('chocolates', JSON.stringify(data.chocolates));
    }
    
    if (data.addOns && data.addOns.length > 0) {
      formData.append('addOns', JSON.stringify(data.addOns));
    }

    // الصورة
    if (data.image ) {
      formData.append('image', data.image);
    }

    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;

    return this.http
      .patch(environment.API + `/projects/${id}`, formData, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
