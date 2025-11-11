import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <form (ngSubmit)="iniciarSesion()" autocomplete="off">
          <div class="form-group">
            <label for="correo">Correo</label>
            <input
              type="email"
              id="correo"
              name="correo"
              [(ngModel)]="correo"
              required
              placeholder="tuemail@ejemplo.com"
            />
          </div>

          <div class="form-group">
            <label for="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              [(ngModel)]="contrasena"
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" [disabled]="cargando">
            {{ cargando ? 'Entrando...' : 'Entrar' }}
          </button>

          <p *ngIf="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Reseteo total para eliminar cualquier borde blanco */
    :host, html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      font-family: 'Segoe UI', sans-serif;
    }

    /* Fondo azul degradado que ocupa toda la pantalla */
    .login-page {
      position: fixed; /* asegura que ocupe toda la pantalla */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #004e92, #000428);
    }

    /* Formulario centrado sobre el fondo azul */
    .login-card {
      background: #ffffff;
      padding: 2.5rem 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
      text-align: center;
      animation: fadeIn 0.6s ease-in-out;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #004e92;
    }

    .form-group {
      text-align: left;
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.3rem;
      font-weight: 600;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.7rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 15px;
      transition: all 0.3s ease;
    }

    input:focus {
      border-color: #004e92;
      box-shadow: 0 0 5px rgba(0, 78, 146, 0.4);
      outline: none;
    }

    button {
      width: 100%;
      padding: 0.8rem;
      border: none;
      background: linear-gradient(135deg, #004e92, #000428);
      color: #fff;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.1s ease;
      margin-top: 1rem;
    }

    button:hover {
      background: linear-gradient(135deg, #005bb5, #001f3f);
      transform: scale(1.02);
    }

    .error {
      color: #d9534f;
      font-weight: bold;
      margin-top: 1rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Ajustes para pantallas pequeñas */
    @media (max-width: 500px) {
      .login-card {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  cargando = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.cargando = true;
    this.error = '';

    localStorage.removeItem('token');
    localStorage.removeItem('rol');

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          const rol = response.usuario?.rol;
          if (rol) {
            localStorage.setItem('rol', rol);
          } else {
            this.error = 'No se pudo obtener el rol del usuario';
            this.cargando = false;
            return;
          }

          if (rol === 'Administrador') {
            this.router.navigate(['/usuarios']);
          } else if (rol === 'Tutor') {
            this.router.navigate(['/vuelos']);
          } else if (rol === 'Alumno') {
            this.router.navigate(['/mis-vuelos']);
          } else {
            this.error = 'Rol no reconocido';
          }
        } else {
          this.error = 'Error al recibir el token';
        }

        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Correo o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}
