import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError, throwError } from 'rxjs';
import { TokenHelper } from '../../TokenHelper';
import { AddMontage } from './add-montage.type';

@Injectable({
  providedIn: 'root',
})
export class AddMontageService {
  http = inject(HttpClient);

  constructor(private tokenHelper: TokenHelper) {}

  addMontage(data: AddMontage) {
    const token = this.tokenHelper.getAccessToken();

    const formData = new FormData();

    // البيانات النصية
    formData.append('title', data.title);
    formData.append('price', String(data.price));
    if (data.TwoKindsOfChocolate === true) {
      formData.append('TwoKindsOfChocolate', String(data.TwoKindsOfChocolate));
    }
    if (data.FourTypesOfChocolate === true) {
      formData.append(
        'FourTypesOfChocolate',
        String(data.FourTypesOfChocolate)
      );
    }
    // تحويل الـ Arrays إلى JSON Strings
    formData.append('chocolates', JSON.stringify(data.chocolates));
    formData.append('addOns', JSON.stringify(data.addOns));

    // الصورة
    if (data.image) {
      formData.append('image', data.image);
    }

    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;

    return this.http
      .post(environment.API + '/projects', formData, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
