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
  selector: 'app-dashboard-tutor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tutor.html',
  styleUrls: ['./dashboard-tutor.css']
})
export class DashboardTutorComponent {

  dashboardItems: DashboardItem[] = [
    {
      titulo: 'Mi Horario de Vuelos',
      descripcion: 'Consulta todos tus vuelos en un calendario moderno.',
      icono: '📆',
      ruta: '/tutor/horario'
    },
    {
      titulo: 'Actualizar Vuelos',
      descripcion: 'Marca vuelos como completados o cancelados.',
      icono: '🛫',
      ruta: '/tutor/vuelos'
    },
    {
      titulo: 'Observaciones de Alumnos',
      descripcion: 'Registra notas y evaluaciones de tus alumnos.',
      icono: '📝',
      ruta: '/tutor/observaciones'
    }
  ];

  constructor(private router: Router) {}

  ir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
