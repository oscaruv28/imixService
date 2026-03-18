import { Component, ChangeDetectorRef } from '@angular/core';
import { CreditService } from '../credit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-form',
  templateUrl: './credit-form.component.html',
  standalone: false,
  styles: []
})
export class CreditFormComponent {
  monto: number = 0;
  loading: boolean = false;
  resultado: any = null;

  constructor(
    private creditService: CreditService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  enviar() {
    if (this.monto <= 0) return;
    
    this.loading = true;
    this.resultado = null; // Limpiar vista anterior

    this.creditService.enviarSolicitud({ amount: this.monto }).subscribe({
      next: (res) => {
        // SEGÚN TU JSON: El backend devuelve { data: { ... } }
        // Guardamos 'res.data' para que el HTML acceda directo
        this.resultado = res.data; 
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Respuesta procesada:', this.resultado);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en la solicitud:', err);
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}