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
      descripcion: 'Consulta tu calendario de vuelos y programación actual.',
      icono: '📆',
      ruta: '/alumno/mis-vuelos'
    },
    {
      titulo: 'Historial de Vuelos',
      descripcion: 'Revisa todos los vuelos que has completado.',
      icono: '🧾',
      ruta: '/alumno/historial'
    },
    {
      titulo: 'Notificaciones',
      descripcion: 'Revisa los avisos por cambios o cancelaciones de vuelos.',
      icono: '🔔',
      ruta: '/alumno/notificaciones'
    }
  ];

  constructor(private router: Router) {}

  ir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
