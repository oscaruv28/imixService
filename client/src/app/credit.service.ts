import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private API_URL = 'http://localhost:3000/credits'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  enviarSolicitud(datos: any): Observable<any> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.API_URL}/request`, datos, { headers });
  }

  obtenerHistorial(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.API_URL}/history`, { headers });
  }
}