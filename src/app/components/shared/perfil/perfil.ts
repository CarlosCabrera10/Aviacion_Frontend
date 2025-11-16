import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {

  rol = localStorage.getItem('rol');
  idUsuario = Number(localStorage.getItem('id_usuario'));

  mostrarContrasena = false;

  esAlumno = this.rol === 'Alumno';

  form = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    nuevaContrasena: '',
    rol: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  toggleContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  cargarPerfil() {
    this.http.get<any>(`http://localhost:8080/api/usuarios/perfil/${this.idUsuario}`)
      .subscribe({
        next: (resp) => {
          this.form = {
            nombre: resp.nombre,
            apellido: resp.apellido,
            correo: resp.correo,
            telefono: resp.telefono,
            nuevaContrasena: '',
            rol: resp.rol
          };

          this.esAlumno = resp.rol === 'Alumno';
        },
        error: () => Swal.fire("Error", "No se pudo cargar tu perfil", "error")
      });
  }

  validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  validarTelefono(telefono: string): boolean {
    return /^\d{4}-\d{4}$/.test(telefono);
  }

  guardarCambios() {

    if (!this.validarCorreo(this.form.correo)) {
      Swal.fire("Correo inválido", "Debe tener un formato correcto: ejemplo@correo.com", "warning");
      return;
    }

    if (!this.validarTelefono(this.form.telefono)) {
      Swal.fire("Teléfono inválido", "Debe tener formato 1234-5678", "warning");
      return;
    }

    this.http.put<any>(
      `http://localhost:8080/api/usuarios/perfil/${this.idUsuario}`,
      this.form
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          timer: 1800,
          showConfirmButton: false
        });
      },
      error: (err) => {
        Swal.fire('Error', err.error?.error || 'Error al actualizar perfil', 'error');
      }
    });
  }
}
