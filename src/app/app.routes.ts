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
import { MantenimientoListComponent } from './components/mantenimiento/mantenimiento-list.component';
import { MantenimientoFormComponent } from './components/mantenimiento/mantenimiento-form.component';
import { EspaciosVueloListComponent } from './components/espacio_vuelo/espaciovuelo-list.component';
import { EspaciosVueloFormComponent } from './components/espacio_vuelo/espaciovuelo-form.component';



// Tutor
import { DashboardTutorComponent } from './components/tutor/dashboard-tutor/dashboard-tutor';
import { TutorHorarioComponent } from './components/tutor/horario-tutor/horario-tutor';
import { VuelosTutorComponent } from './components/tutor/vuelos-tutor/vuelos-tutor';
import { EditarVueloComponent } from './components/tutor/editar-vuelo/editar-vuelo';
import { AlumnosTutorComponent } from './components/tutor/alumnos-tutor/alumnos-tutor';
import { DetalleAlumnoComponent } from './components/tutor/detalle-alumno/detalle-alumno';
import { DetalleVueloComponent } from './components/tutor/detalle-vuelo/detalle-vuelo';




// Alumno (luego lo creas)
import { RendimientoAlumnoComponent } from './components/alumno/rendimiento-alumno/rendimiento-alumno';
import { DetalleVueloAlumnoComponent } from './components/alumno/vuelo-detalle/vuelo-detalle';
import { HorarioAlumnoComponent } from './components/alumno/horario-alumno/horario-alumno';
import { DashboardAlumnoComponent } from './components/alumno/dashboard-alumno/dashboard-alumno';
import{ MisVuelosAlumnoComponent  } from './components/alumno/mis-vuelos-alumno/mis-vuelos-alumno';
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

      { path: 'mantenimientos', component: MantenimientoListComponent },          
      { path: 'mantenimientos/form', component: MantenimientoFormComponent },     
      { path: 'mantenimientos/form/:id', component: MantenimientoFormComponent },  

      {path: 'espacios', component: EspaciosVueloListComponent },
      {path: 'espacios/nuevo', component: EspaciosVueloFormComponent },
      {path: 'espacios/:id', component: EspaciosVueloFormComponent },
      
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
    { path: 'horario', component: TutorHorarioComponent },

    // Listado de vuelos para actualizar
    { path: 'vuelos', component: VuelosTutorComponent },

    // editar vuelo
    { path: 'vuelos/editar/:id', component: EditarVueloComponent },

    // historial de vuelos
    { path: 'vuelos-historial', component: VuelosTutorComponent },

    // listado de alumnos
    { path: 'alumnos', component: AlumnosTutorComponent },
  

    // detalle alumno (lo activamos más adelante)
    { path: 'alumnos/:id', component: DetalleAlumnoComponent },
     { path: 'vuelos/detalle/:id', component: DetalleVueloComponent }
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
  {path: 'rendimiento', component: RendimientoAlumnoComponent },
  {path: 'vuelo/detalle/:id', component: DetalleVueloAlumnoComponent },
  {path: 'horario', component: HorarioAlumnoComponent },
  {path: 'mis-vuelos', component: MisVuelosAlumnoComponent },
   


      //{ path: 'mis-vuelos', component: MisVuelosComponent },
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' },
 
];
