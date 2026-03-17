import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { CreditService } from './credit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  // Login
  email = '';
  password = '';
  // Credito
  monto = 0;
  // Estados
  loading = false;
  error = '';
  resultado: any = null;

  constructor(
    private authService: AuthService,
    private creditService: CreditService
  ) {}

  isLoggedIn() {
    return !!this.authService.getToken();
  }

  login() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        console.log("Login exitoso");
      },
      error: () => {
        this.error = "Credenciales inválidas";
        this.loading = false;
      }
    });
  }

  enviarCredito() {
    this.loading = true;
    this.error = '';
    this.creditService.enviarSolicitud({ monto: this.monto, clienteId: 'CLI-99' }).subscribe({
      next: (res) => {
        this.resultado = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Error de sesión o conexión. Intenta login de nuevo.";
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.resultado = null;
  }
}