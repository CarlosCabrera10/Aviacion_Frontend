import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DashboardItem {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-dashboard-alumno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-alumno.html',
  styleUrls: ['./dashboard-alumno.css']
})
export class DashboardAlumnoComponent {

  dashboardItems: DashboardItem[] = [
    {
      titulo: 'Mis Vuelos',
      descripcion: 'Consulta tu programación y vuelos activos.',
      icono: 'calendar',
      ruta: '/alumno/mis-vuelos'
    },
    {
      titulo: 'Historial de Vuelos',
      descripcion: 'Revisa todos tus vuelos completados.',
      icono: 'history',
      ruta: '/alumno/historial'
    },
    {
      titulo: 'Notificaciones',
      descripcion: 'Consulta avisos y cambios importantes.',
      icono: 'bell',
      ruta: '/alumno/notificaciones'
    }
  ];

  constructor(private router: Router) {}

  ir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
