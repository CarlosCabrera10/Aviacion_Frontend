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
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent {

  dashboardItems: DashboardItem[] = [
    {
      titulo: 'Gestión de Usuarios',
      descripcion: 'Administra alumnos, tutores y personal del sistema.',
      icono: '👥',
      ruta: '/admin/usuarios'
    },
    {
      titulo: 'Gestión de Avionetas',
      descripcion: 'Controla el estado, código y horas de vuelo.',
      icono: '✈️',
      ruta: '/admin/avionetas'
    },
    {
      titulo: 'Programación de Vuelos',
      descripcion: 'Asigna vuelos a alumnos, tutores y avionetas.',
      icono: '🗓️',
      ruta: '/admin/vuelos'
    },
    {
      titulo: 'Reportes y Estadísticas',
      descripcion: 'Visualiza uso de avionetas, horas de vuelo y mapas térmicos.',
      icono: '📊',
      ruta: '/admin/reportes'
    }
  ];

  constructor(private router: Router) {}

  ir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
