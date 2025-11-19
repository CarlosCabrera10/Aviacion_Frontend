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
  sidebarAbierto = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.rol$.subscribe(rol => {
      this.rol = rol;
      this.cargarMenu();
    });

    this.rol = this.authService.getRol();
    this.cargarMenu();
  }

  cargarMenu() {
    if (!this.rol) return;

    if (this.rol === 'Administrador') {
      this.menuItems = [
        { titulo: 'Dashboard', icono: 'home', ruta: '/admin/dashboard' },
        { titulo: 'Usuarios', icono: 'users', ruta: '/admin/usuarios' },
        { titulo: 'Avionetas', icono: 'plane', ruta: '/admin/avionetas' },
        { titulo: 'Espacios', icono: 'map', ruta: '/admin/espacios' },
        { titulo: 'Mantenimientos', icono: 'tools', ruta: '/admin/mantenimientos' },
        { titulo: 'Vuelos', icono: 'calendar', ruta: '/admin/vuelos' },
        { titulo: 'Reportes', icono: 'report', ruta: '/admin/reportes' }
      ];
    }

    if (this.rol === 'Tutor') {
      this.menuItems = [
        { titulo: 'Dashboard', icono: 'home', ruta: '/tutor/dashboard' },
        { titulo: 'Mi Horario', icono: 'calendar', ruta: '/tutor/horario' },
        { titulo: 'Actualizar Vuelos', icono: 'plane', ruta: '/tutor/vuelos' },
        { titulo: 'Historial', icono: 'book', ruta: '/tutor/vuelos-historial' },
        { titulo: 'Mis Alumnos', icono: 'student', ruta: '/tutor/alumnos' }
      ];
    }

    if (this.rol === 'Alumno') {
      this.menuItems = [
        { titulo: 'Dashboard', icono: 'home', ruta: '/alumno/dashboard' },
        { titulo: 'Notificaciones', icono: 'bell', ruta: '/alumno/notificaciones' },
        { titulo: 'Rendimiento', icono: 'report', ruta: '/alumno/rendimiento' },
        { titulo: 'Mi Horario', icono: 'calendar', ruta: '/alumno/horario' },
        { titulo: 'Mis Vuelos', icono: 'plane', ruta: '/alumno/mis-vuelos' }
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

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }
}
