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
    <div class="list-container">
      <h2>Usuarios</h2>

      <button (click)="nuevoUsuario()" class="btn btn-primary">+ Nuevo Usuario</button>

      <table>
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
              <button (click)="editarUsuario(usuario.id)" class="btn-edit">✏️</button>
              <button (click)="eliminarUsuario(usuario.id)" class="btn-delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .list-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #343a40;
      font-weight: 700;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    th, td {
      padding: 0.8rem;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }

    th {
      background: #e9ecef;
      font-weight: 600;
    }

    tr:hover {
      background: #f1f3f5;
    }

    button {
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: transform 0.2s;
      margin-right: 5px;
    }

    button:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      background-color: #007bff;
      color: #fff;
      margin-bottom: 1rem;
    }

    .btn-edit {
      background-color: #17a2b8;
      color: #fff;
    }

    .btn-edit:hover {
      background-color: #117a8b;
    }

    .btn-delete {
      background-color: #dc3545;
      color: #fff;
    }

    .btn-delete:hover {
      background-color: #c82333;
    }
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
