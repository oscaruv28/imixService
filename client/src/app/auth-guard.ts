import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();

  // DEBUG: Esto te dirá exactamente qué está leyendo el Guard
  console.log('Valor del token en el Guard:', token);

  // Verificamos que el token exista y no sea un string de error común
  if (token && token !== 'null' && token !== 'undefined' && token.length > 10) {
    return true; 
  } else {
    console.warn('Acceso denegado: No hay token válido. Redirigiendo...');
    router.navigate(['/login']);
    return false;
  }
};