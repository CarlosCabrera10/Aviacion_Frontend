import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorService } from '../../../services/tutor.service';
import { Usuario } from '../../../models/usuario.model';
import { FormsModule } from '@angular/forms';   // 👈 IMPORTANTE
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-alumnos-tutor',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './alumnos-tutor.html',
  styleUrls: ['./alumnos-tutor.css']
})
export class AlumnosTutorComponent implements OnInit {

  alumnos: Usuario[] = [];
  alumnosFiltrados: Usuario[] = [];

  loading = true;

  filtro = '';
  pagina = 0;
  size = 6; // 6 cards por página

  idTutor = Number(localStorage.getItem('id_usuario'));

  constructor(
    private tutorService: TutorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.tutorService.obtenerAlumnos(this.idTutor).subscribe({
      next: (data) => {
        this.alumnos = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  aplicarFiltros() {
    const f = this.filtro.toLowerCase();

    this.alumnosFiltrados = this.alumnos.filter(a =>
      a.nombre.toLowerCase().includes(f) ||
      a.apellido.toLowerCase().includes(f) ||
      a.correo.toLowerCase().includes(f)
    );

    this.pagina = 0;
  }

  paginados() {
    const inicio = this.pagina * this.size;
    return this.alumnosFiltrados.slice(inicio, inicio + this.size);
  }

  cambiarPagina(delta: number) {
    const nueva = this.pagina + delta;
    if (nueva >= 0 && nueva < (this.alumnosFiltrados.length / this.size)) {
      this.pagina = nueva;
    }
  }

verDetalle(alumno: Usuario) {
  this.router.navigate(['/tutor/alumnos', alumno.id]);
}

}
