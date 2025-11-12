import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list.component';
import { UsuariosFormComponent } from './components/usuarios/usuarios-form.component';
import { AvionetasListComponent } from './components/avionetas/avionetas-list.component';
import { AvionetasFormComponent } from './components/avionetas/avionetas-form.component';
import { VuelosListComponent } from './components/vuelos/vuelos-list.component';
import { VuelosFormComponent } from './components/vuelos/vuelos-form.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 🔒 Usuarios
  { path: 'usuarios', component: UsuariosListComponent, canActivate: [authGuard] },
  { path: 'usuarios/nuevo', component: UsuariosFormComponent, canActivate: [authGuard] },
  { path: 'usuarios/editar/:id', component: UsuariosFormComponent, canActivate: [authGuard] },

  // 🔒 Avionetas
  { path: 'avionetas', component: AvionetasListComponent, canActivate: [authGuard] },
  { path: 'avionetas/nueva', component: AvionetasFormComponent, canActivate: [authGuard] },
  { path: 'avionetas/editar/:id', component: AvionetasFormComponent, canActivate: [authGuard] },

  // 🔒 Vuelos
  { path: 'vuelos', component: VuelosListComponent, canActivate: [authGuard] },
  { path: 'vuelos/nuevo', component: VuelosFormComponent, canActivate: [authGuard] },
  { path: 'vuelos/editar/:id', component: VuelosFormComponent, canActivate: [authGuard] },

  // 🚫 Ruta por defecto
  { path: '**', redirectTo: 'login' }
];
