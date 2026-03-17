import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private API_URL = 'http://localhost:3000/credits'; 

  constructor(private http: HttpClient) {}

  enviarSolicitud(datos: any): Observable<any> {
    return this.http.post(`${this.API_URL}/process`, datos);
  }
}