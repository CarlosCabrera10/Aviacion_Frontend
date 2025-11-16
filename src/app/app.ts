// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent, SidebarComponent],
  template: `
    <app-sidebar></app-sidebar>

    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class App {}
