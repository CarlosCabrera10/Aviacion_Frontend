import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {

  correo = '';
  contrasena = '';
  cargando = false;
  error = '';

  mostrarPassword = false;  // 👈 Toggle contraseña

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

          if (!rol) {
            this.error = 'No se pudo obtener el rol del usuario';
            this.cargando = false;
            return;
          }

          localStorage.setItem('rol', rol);

          if (rol === 'Administrador') this.router.navigate(['/admin/dashboard']);
          else if (rol === 'Tutor') this.router.navigate(['/tutor/dashboard']);
          else if (rol === 'Alumno') this.router.navigate(['/alumno/dashboard']);
        } else {
          this.error = 'Error al recibir el token';
        }

        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Correo o contraseña incorrectos';
        this.cargando = false;
      },
    });
  }
}
