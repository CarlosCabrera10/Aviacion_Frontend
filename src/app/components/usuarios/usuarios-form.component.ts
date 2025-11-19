import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'usuarios-form.html',
  styleUrls: ['usuarios-form.css'],
})
export class UsuariosFormComponent implements OnInit {
  usuario: Usuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    rol: '',
    contrasena: '',
    activo: true,
  };

  editMode = false;
  mensajeError = '';
  mensajeExito = '';
  mostrarPass = false;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editMode = true;
      this.usuariosService.obtenerPorId(+id).subscribe({
        next: (data) => {
          this.usuario = data;
        },
        error: () => {
          this.mensajeError = 'Error al cargar datos del usuario.';
        },
      });
    }
  }

  private obtenerMensajeError(err: any): string {
    if (!err) return 'Error desconocido';

    // Si backend devuelve string
    if (typeof err === 'string') return err;

    // Si backend devuelve objeto con mensaje
    if (err.error?.mensaje) return err.error.mensaje;

    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error.message) return err.error.message;
    }

    if (err.message) return err.message;

    return 'Ocurrió un error inesperado';
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor llena todos los campos correctamente.',
        confirmButtonColor: '#003060',
      });
      return;
    }

    // CREAR
    if (!this.editMode) {
      this.usuariosService.guardar(this.usuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El usuario fue registrado correctamente.',
            confirmButtonColor: '#003060',
          }).then(() => {
            this.router.navigate(['/admin/usuarios']);
          });
        },
        error: (err) => {
          const msg = this.obtenerMensajeError(err);

          Swal.fire({
            icon: 'error',
            title: 'No se pudo crear el usuario',
            text: msg,
            confirmButtonColor: '#C0392B',
          });
        },
      });
      return;
    }

    // EDITAR
    if (this.editMode && this.usuario.id) {
      this.usuariosService.actualizar(this.usuario.id, this.usuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado',
            text: 'Los datos fueron guardados correctamente.',
            confirmButtonColor: '#003060',
          }).then(() => {
            this.router.navigate(['/admin/usuarios']);
          });
        },
        error: (err) => {
          const msg = this.obtenerMensajeError(err);

          Swal.fire({
            icon: 'error',
            title: 'No se pudo crear el usuario',
            text: msg,
            confirmButtonColor: '#C0392B',
          });
        },
      });
    }
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
}
