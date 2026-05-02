import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError } from 'rxjs';
import { TokenHelper } from '../../TokenHelper';
import { User } from './clients.type';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  http = inject(HttpClient);
  constructor(private tokenHelper: TokenHelper) {}
  getClients() {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.get<User>(environment.API + '/auth', { headers }).pipe(
      catchError((error) => {
        return error;
      })
    );
  }

  getPDF() {
    const token = this.tokenHelper.getAccessToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.get(environment.API + '/pdf', {
      headers,
      responseType: 'blob', // Specify that we expect a blob response
    }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }


}
