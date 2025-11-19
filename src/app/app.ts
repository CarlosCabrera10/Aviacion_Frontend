// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent, SidebarComponent],
  template: `
 

    <!-- Contenedor principal -->
 <div class="layout">
   <!-- Sidebar solo cuando debe mostrarse -->
    <app-sidebar *ngIf="mostrarSidebar"></app-sidebar>
 

  <div class="layout-content">
    <router-outlet></router-outlet>
  </div>

</div>
  `,
  styleUrls: ['./app.css']
})
export class App {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get mostrarSidebar(): boolean {
    const url = this.router.url;

    // Rutas donde NO queremos sidebar
    const esRutaAuth =
      url.startsWith('/login') ||
      url.startsWith('/recuperar') ||
      url.startsWith('/registro');

    // Si tienes un método mejor en AuthService, cámbialo aquí
    const estaLogueado = !!this.authService.getRol();

    return estaLogueado && !esRutaAuth;
  }
}
