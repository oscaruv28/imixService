import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CreditService } from './credit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: false
})
export class App implements OnInit {
  email = ''; password = ''; monto = 0;
  loading = false; error = ''; resultado: any = null;

  constructor(
    private authService: AuthService,
    private creditService: CreditService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.getToken()) {
      this.router.navigate(['/credit']);
    }
  }

  login() {
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/credit']);
      },
      error: () => {
        this.error = "Acceso denegado";
        this.loading = false;
      }
    });
  }

  enviarCredito() {
    this.loading = true;
    this.creditService.enviarSolicitud({ amount: this.monto }).subscribe({
      next: (res) => {
        this.resultado = res;
        this.loading = false;
      },
      error: () => {
        this.error = "Error en la solicitud";
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isRoute(route: string) {
    return this.router.url.includes(route);
  }
}