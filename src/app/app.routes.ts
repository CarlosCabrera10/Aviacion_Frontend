import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list.component'; // Ejemplo

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // 👈 redirige al login al inicio
  { path: 'login', component: LoginComponent },
  { path: 'usuarios', component: UsuariosListComponent },
  { path: '**', redirectTo: 'login' } // 👈 por si ponen una ruta no válida
];
