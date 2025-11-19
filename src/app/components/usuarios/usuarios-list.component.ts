import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'usuarios-list.html',
  styleUrls: ['usuarios-list.css']
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];
  filtrados: Usuario[] = [];
  pagina: Usuario[] = [];

  // filtros
  search = '';
  filtroRol = '';

  // paginación
  paginaActual = 0;
  size = 10;
  totalPaginas = 1;

  constructor(private usuarioService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.filtrados = this.usuarios.filter(u => {
      const matchTexto =
        u.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
        u.correo.toLowerCase().includes(this.search.toLowerCase());

      const matchRol = !this.filtroRol || u.rol === this.filtroRol;

      return matchTexto && matchRol;
    });

    this.paginar();
  }

  paginar() {
    this.totalPaginas = Math.ceil(this.filtrados.length / this.size) || 1;

    const start = this.paginaActual * this.size;
    this.pagina = this.filtrados.slice(start, start + this.size);
  }

  cambiarPagina(dir: number) {
    this.paginaActual = Math.min(
      Math.max(this.paginaActual + dir, 0),
      this.totalPaginas - 1
    );
    this.paginar();
  }

  irNueva() {
    this.router.navigate(['/admin/usuarios/nuevo']);
  }

  editarUsuario(id: number | undefined) {
    if (id) this.router.navigate(['/admin/usuarios/editar', id]);
  }

  eliminarUsuario(id: number | undefined) {
    if (id && confirm('¿Eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe(() => this.cargarUsuarios());
    }
  }
}
