import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface SidebarItem {
  titulo: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  rol: string | null = null;
  menuItems: SidebarItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    // 🔹 Escuchar rol en tiempo real
    this.authService.rol$.subscribe(rol => {
      this.rol = rol;
      this.cargarMenu();
    });

    // 🔹 También cargar por si ya había sesión guardada
    this.rol = this.authService.getRol();
    this.cargarMenu();
  }

  cargarMenu() {
    if (!this.rol) return;

    if (this.rol === 'Administrador') {
      this.menuItems = [
        { titulo: 'Dashboard', icono: '🏠', ruta: '/admin/dashboard' },
        { titulo: 'Usuarios', icono: '👥', ruta: '/admin/usuarios' },
        { titulo: 'Avionetas', icono: '✈️', ruta: '/admin/avionetas' },
        { titulo: 'Espacios', icono: '🗺️', ruta: '/admin/espacios' },
        { titulo: 'Mantenimiento', icono: '🛠️', ruta: '/admin/mantenimientos' },
        { titulo: 'Vuelos', icono: '🛫', ruta: '/admin/vuelos' },
        { titulo: 'Reportes', icono: '📊', ruta: '/admin/reportes' }
      ];
    }

    if (this.rol === 'Tutor') {
      this.menuItems = [
        { titulo: 'Dashboard', icono: '🏠', ruta: '/tutor/dashboard' },
        { titulo: 'Mi Horario', icono: '📅', ruta: '/tutor/horario' },
        { titulo: 'Actualizar Vuelos', icono: '🛫', ruta: '/tutor/vuelos' },
        { titulo: 'Observaciones', icono: '📝', ruta: '/tutor/observaciones' }
      ];
    }

    if (this.rol === 'Alumno') {
      this.menuItems = [
        { titulo: 'Dashboard', icono: '🏠', ruta: '/alumno/dashboard' },
        { titulo: 'Mis Vuelos', icono: '📅', ruta: '/alumno/mis-vuelos' },
        { titulo: 'Historial', icono: '📘', ruta: '/alumno/historial' },
        { titulo: 'Notificaciones', icono: '🔔', ruta: '/alumno/notificaciones' }
      ];
    }
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
