import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Usuarios</h2>

      <button (click)="nuevoUsuario()" class="btn">+ Nuevo Usuario</button>

      <table class="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let usuario of usuarios">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.rol }}</td>
            <td>{{ usuario.activo ? 'Sí' : 'No' }}</td>
            <td>
              <button (click)="editarUsuario(usuario.id)">✏️</button>
              <button (click)="eliminarUsuario(usuario.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 1rem; }
    .btn { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; margin-bottom: 1rem; }
    .tabla { width: 100%; border-collapse: collapse; }
    .tabla th, .tabla td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
    .tabla th { background: #f3f3f3; }
    button { margin-right: 5px; }
  `]
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  nuevoUsuario() {
    this.router.navigate(['/usuarios/nuevo']);
  }

  editarUsuario(id: number | undefined) {
    if (id) this.router.navigate(['/usuarios/editar', id]);
  }

  eliminarUsuario(id: number | undefined) {
    if (id && confirm('¿Eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe(() => this.cargarUsuarios());
    }
  }
}
