import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>{{ editMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h2>

      <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>
        <!-- Nombre -->
        <div class="row">
          <label>Nombre:</label>
          <input
            class="input"
            name="nombre"
            [(ngModel)]="usuario.nombre"
            required
            minlength="2"
            maxlength="50"
            #nombre="ngModel"
          />
          <div class="error" *ngIf="nombre.invalid && (nombre.dirty || nombre.touched)">
            <small *ngIf="nombre.errors?.['required']">El nombre es obligatorio.</small>
            <small *ngIf="nombre.errors?.['minlength']">Debe tener al menos 2 caracteres.</small>
            <small *ngIf="nombre.errors?.['maxlength']">Máximo 50 caracteres.</small>
          </div>
        </div>

        <!-- Apellido -->
        <div class="row">
          <label>Apellido:</label>
          <input
            class="input"
            name="apellido"
            [(ngModel)]="usuario.apellido"
            required
            minlength="2"
            maxlength="50"
            #apellido="ngModel"
          />
          <div class="error" *ngIf="apellido.invalid && (apellido.dirty || apellido.touched)">
            <small *ngIf="apellido.errors?.['required']">El apellido es obligatorio.</small>
            <small *ngIf="apellido.errors?.['minlength']">Debe tener al menos 2 caracteres.</small>
            <small *ngIf="apellido.errors?.['maxlength']">Máximo 50 caracteres.</small>
          </div>
        </div>

        <!-- Correo -->
        <div class="row">
          <label>Correo:</label>
          <input
            class="input"
            type="email"
            name="correo"
            [(ngModel)]="usuario.correo"
            required
            email
            #correo="ngModel"
          />
          <div class="error" *ngIf="correo.invalid && (correo.dirty || correo.touched)">
            <small *ngIf="correo.errors?.['required']">El correo es obligatorio.</small>
            <small *ngIf="correo.errors?.['email']">Formato de correo no válido.</small>
          </div>
        </div>

        <!-- Teléfono -->
        <div class="row">
          <label>Teléfono:</label>
          <input
            class="input"
            name="telefono"
            [(ngModel)]="usuario.telefono"
            pattern="^[0-9]{4}-[0-9]{4}$"
            placeholder="0000-0000"
            required
            #telefono="ngModel"
          />
          <small class="hint">Formato: 0000-0000</small>
          <div class="error" *ngIf="telefono.invalid && (telefono.dirty || telefono.touched)">
            <small *ngIf="telefono.errors?.['required']">El teléfono es obligatorio.</small>
            <small *ngIf="telefono.errors?.['pattern']">Debe tener el formato 0000-0000.</small>
          </div>
        </div>

        <!-- Rol -->
        <div class="row">
          <label>Rol:</label>
          <select
            class="input"
            name="rol"
            [(ngModel)]="usuario.rol"
            required
            #rol="ngModel"
          >
            <option value="" disabled>Seleccione un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Tutor">Tutor</option>
            <option value="Alumno">Alumno</option>
          </select>
          <div class="error" *ngIf="rol.invalid && (rol.dirty || rol.touched)">
            <small>Debe seleccionar un rol.</small>
          </div>
        </div>

        <!-- Estado -->
        <div class="row">
          <label>Estado:</label>
          <select
            class="input"
            name="activo"
            [(ngModel)]="usuario.activo"
            required
            #activo="ngModel"
          >
            <option [ngValue]="true">Activo</option>
            <option [ngValue]="false">Inactivo</option>
          </select>
          <div class="error" *ngIf="activo.invalid && (activo.dirty || activo.touched)">
            <small>Debe seleccionar un estado.</small>
          </div>
        </div>

        <!-- Contraseña (solo al crear) -->
        <div class="row" *ngIf="!editMode">
          <label>Contraseña:</label>
          <input
            type="password"
            class="input"
            name="contrasena"
            [(ngModel)]="usuario.contrasena"
            required
            minlength="6"
            #contrasena="ngModel"
          />
          <div class="error" *ngIf="contrasena.invalid && (contrasena.dirty || contrasena.touched)">
            <small *ngIf="contrasena.errors?.['required']">La contraseña es obligatoria.</small>
            <small *ngIf="contrasena.errors?.['minlength']">Debe tener al menos 6 caracteres.</small>
          </div>
        </div>

        <!-- Mensajes globales -->
        <div class="error" *ngIf="mensajeError">{{ mensajeError }}</div>
        <div class="success" *ngIf="mensajeExito">{{ mensajeExito }}</div>

        <!-- Botones -->
        <div class="actions">
          <button type="submit" [disabled]="form.invalid">
            {{ editMode ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="cancel" (click)="cancelar()">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 1.5rem;
    }
    .row {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
    }
    label {
      font-weight: bold;
      margin-bottom: 0.3rem;
      color: #444;
    }
    .input {
      padding: 0.6rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 14px;
    }
    .hint {
      font-size: 12px;
      color: #777;
      margin-top: 0.2rem;
    }
    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
    }
    button {
      background: #007bff;
      color: white;
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #0056b3;
    }
    .cancel {
      background: #6c757d;
    }
    .cancel:hover {
      background: #5a6268;
    }
    .error {
      color: #d9534f;
      font-size: 13px;
      margin-top: 0.3rem;
    }
    .success {
      color: #28a745;
      font-weight: bold;
      margin-top: 0.5rem;
    }
  `]
})
export class UsuariosFormComponent implements OnInit {
  usuario: Usuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    rol: '',
    contrasena: '',
    activo: true
  };

  editMode = false;
  mensajeError = '';
  mensajeExito = '';

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
          this.mensajeError = 'Error al cargar los datos del usuario.';
        }
      });
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      this.mensajeError = 'Por favor, complete todos los campos correctamente.';
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.editMode && this.usuario.id) {
      this.usuariosService.actualizar(this.usuario.id, this.usuario).subscribe({
        next: () => {
          this.mensajeExito = 'Usuario actualizado correctamente.';
          setTimeout(() => this.router.navigate(['/usuarios']), 1000);
        },
        error: () => {
          this.mensajeError = 'Error al actualizar el usuario.';
        }
      });
    } else {
      this.usuariosService.guardar(this.usuario).subscribe({
        next: () => {
          this.mensajeExito = 'Usuario guardado correctamente.';
          setTimeout(() => this.router.navigate(['/usuarios']), 1000);
        },
        error: () => {
          this.mensajeError = 'Error al guardar el usuario.';
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }
}
