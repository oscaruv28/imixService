import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private API_URL = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/login`, { username, password })
            .pipe(
                tap(res => {
                    if (res && res.data && res.data.accessToken) {
                        localStorage.setItem('token', res.data.accessToken);
                        console.log('Token guardado correctamente');
                    }
                })
            );
    }

    // auth.service.ts
    getToken(): string | null {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') return null;
        return token;
    }

    logout(): void {
        localStorage.removeItem('token');
    }
}