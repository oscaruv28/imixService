import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CreditFormComponent } from './credit-form/credit-form.component';
import { authGuard } from './auth-guard'; // <--- Verifica que esta ruta sea correcta

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'credit', 
    component: CreditFormComponent, 
    canActivate: [authGuard] // <--- EL BLOQUEO
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }