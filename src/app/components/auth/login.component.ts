import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form (ngSubmit)="login()">
        <input [(ngModel)]="correo" name="correo" placeholder="Correo" required />
        <input [(ngModel)]="contrasena" name="contrasena" type="password" placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>
        <div *ngIf="error" class="error">{{ error }}</div>
      </form>
    </div>
  `,
  styles: [`
    .login-container { max-width: 400px; margin: 3rem auto; padding: 2rem; background: #fff; border-radius: 10px; }
    .error { color: red; margin-top: 0.5rem; }
  `]
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.correo, this.contrasena).subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: () => {
        this.error = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }
}
