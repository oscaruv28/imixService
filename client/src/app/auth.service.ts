import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.accessToken) {
            localStorage.setItem('token', res.accessToken);
          }
        })
      );
  }

  getToken() {
    return localStorage.getItem('token');
  }
}