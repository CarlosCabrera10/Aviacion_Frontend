import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { authGuard } from './services/auth.guard';

import { PerfilComponent } from './components/shared/perfil/perfil';

// Guards por rol
import { adminGuard } from './services/admin.guard';
import { tutorGuard } from './services/tutor.guard';
import { alumnoGuard } from './services/alumno.guard';

// Admin
import { UsuariosListComponent } from './components/usuarios/usuarios-list.component';
import { UsuariosFormComponent } from './components/usuarios/usuarios-form.component';
import { AvionetasListComponent } from './components/avionetas/avionetas-list.component';
import { AvionetasFormComponent } from './components/avionetas/avionetas-form.component';
import { VuelosListComponent } from './components/vuelos/vuelos-list.component';
import { VuelosFormComponent } from './components/vuelos/vuelos-form.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin';


// Tutor
import { DashboardTutorComponent } from './components/tutor/dashboard-tutor/dashboard-tutor';
import { TutorHorarioComponent } from './components/tutor/horario-tutor/horario-tutor';
//import { TutorHorarioComponent } from './components/tutor/horario-tutor.component';

// Alumno (luego lo creas)


import { DashboardAlumnoComponent } from './components/alumno/dashboard-alumno/dashboard-alumno';
//import { MisVuelosComponent } from './components/alumno/mis-vuelos.component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
   { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },

  // =========================================================================================
  // ADMINISTRADOR
  // =========================================================================================
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'usuarios/nuevo', component: UsuariosFormComponent },
      { path: 'usuarios/editar/:id', component: UsuariosFormComponent },

      { path: 'avionetas', component: AvionetasListComponent },
      { path: 'avionetas/nueva', component: AvionetasFormComponent },
      { path: 'avionetas/editar/:id', component: AvionetasFormComponent },

      { path: 'vuelos', component: VuelosListComponent },
      { path: 'vuelos/nuevo', component: VuelosFormComponent },
      { path: 'vuelos/editar/:id', component: VuelosFormComponent },

      { path: 'reportes', component: ReportesComponent },


    ]
  },

  // =========================================================================================
  // TUTOR (Instructor)
  // =========================================================================================
  {
    path: 'tutor',
    canActivate: [authGuard, tutorGuard],
    children: [
      { path: 'dashboard', component: DashboardTutorComponent },
      //{ path: 'horario', component: TutorHorarioComponent },
      { path: 'vuelos', component: VuelosListComponent }, 
      { path: 'horario', component:  TutorHorarioComponent, canActivate: [authGuard] },// filtro por tutor luego


    ]
  },

  // =========================================================================================
  // ALUMNO
  // =========================================================================================
  {
    path: 'alumno',
    canActivate: [authGuard, alumnoGuard],
    children: [
   { path: 'dashboard', component: DashboardAlumnoComponent },
   


      //{ path: 'mis-vuelos', component: MisVuelosComponent },
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' },
 
];
