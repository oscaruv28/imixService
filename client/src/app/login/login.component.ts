import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone // Añadimos NgZone por si el router se queda "trabado"
  ) { }

  login() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.cdr.detectChanges(); 
        
        // IMPORTANTE: Cambiamos 'dashboard' por 'credit' para que coincida con tu AppRoutingModule
        this.zone.run(() => {
          this.router.navigate(['/credit']).then(nav => {
            if (!nav) console.error('La navegación a /credit falló');
          });
        });
      },
      error: (err) => {
        this.loading = false;
        // Extraemos el mensaje del JSON del servidor
        this.error = err.error?.message || 'Credenciales inválidas';
        console.error('Error de login:', err);
        this.cdr.detectChanges(); 
      }
    });
  }
}