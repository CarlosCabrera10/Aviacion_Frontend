import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav *ngIf="mostrarMenu" class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a class="navbar-brand" routerLink="/avionetas">✈️ Aviación</a>
      <div class="navbar-nav ms-auto">
        <ng-container *ngIf="rol === 'Administrador'">
          <a class="nav-link" routerLink="/avionetas" routerLinkActive="active">Avionetas</a>
          <a class="nav-link" routerLink="/usuarios" routerLinkActive="active">Usuarios</a>
          <a class="nav-link" routerLink="/vuelos" routerLinkActive="active">Vuelos</a>
          <a class="nav-link" routerLink="/reportes" routerLinkActive="active">Reportes</a>
        </ng-container>

        <ng-container *ngIf="rol === 'Tutor'">
          <a class="nav-link" routerLink="/vuelos" routerLinkActive="active">Vuelos</a>
        </ng-container>

        <ng-container *ngIf="rol === 'Alumno'">
          <a class="nav-link" routerLink="/mis-vuelos" routerLinkActive="active">Mis Vuelos</a>
        </ng-container>

        <button class="btn btn-outline-light ms-3" (click)="cerrarSesion()">Cerrar sesión</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  mostrarMenu = true;
  rol: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.rol = authService.getRol();

    // Suscribirse a cambios de rol
    this.authService.rol$.subscribe(r => this.rol = r);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrarMenu = router.url !== '/login';
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
