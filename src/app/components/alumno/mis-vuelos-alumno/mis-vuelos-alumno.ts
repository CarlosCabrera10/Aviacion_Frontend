import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { AlumnoService } from '../../../services/alumno.service';
import { Vuelo } from '../../../models/vuelos.model';

@Component({
  selector: 'app-mis-vuelos-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-vuelos-alumno.html',
  styleUrls: ['./mis-vuelos-alumno.css']
})
export class MisVuelosAlumnoComponent implements OnInit {

  idAlumno!: number;

  vuelosTotales: Vuelo[] = [];
  vuelosFiltrados: Vuelo[] = [];
  vuelosPagina: Vuelo[] = [];

  // FILTROS
  filtroFecha = '';
  filtroTutor = '';
  filtroAvioneta = '';

  // PAGINACIÓN
  paginaActual = 0;
  size = 10;
  totalPaginas = 1;

  constructor(
    private alumnoService: AlumnoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idAlumno = Number(localStorage.getItem('id_usuario'));
    this.cargarVuelos();
  }

  cargarVuelos() {
    this.alumnoService.obtenerVuelos(this.idAlumno).subscribe(v => {
      this.vuelosTotales = [...v];

      this.vuelosTotales.sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      this.vuelosFiltrados = [...this.vuelosTotales];
      this.paginar();
    });
  }

  /* ================== FILTROS ================== */

  aplicarFiltros() {
    this.vuelosFiltrados = this.vuelosTotales.filter(v => {
      const fFecha = !this.filtroFecha || v.fecha === this.filtroFecha;
      const fTutor = !this.filtroTutor || v.nombreTutor === this.filtroTutor;
      const fAvioneta = !this.filtroAvioneta || v.codigoAvioneta === this.filtroAvioneta;
      return fFecha && fTutor && fAvioneta;
    });

    this.paginar();
  }

  limpiarFiltros() {
    this.filtroFecha = '';
    this.filtroTutor = '';
    this.filtroAvioneta = '';
    this.vuelosFiltrados = [...this.vuelosTotales];
    this.paginar();
  }

  /* ================== PAGINACIÓN ================== */

  paginar() {
    this.totalPaginas = Math.max(1, Math.ceil(this.vuelosFiltrados.length / this.size));
    if (this.paginaActual >= this.totalPaginas) this.paginaActual = this.totalPaginas - 1;

    const start = this.paginaActual * this.size;
    this.vuelosPagina = this.vuelosFiltrados.slice(start, start + this.size);
  }

  cambiarPagina(dir: number) {
    let nueva = this.paginaActual + dir;
    if (nueva < 0) nueva = 0;
    if (nueva >= this.totalPaginas) nueva = this.totalPaginas - 1;
    this.paginaActual = nueva;
    this.paginar();
  }

  irPagina(i: number) {
    this.paginaActual = i;
    this.paginar();
  }

verDetalle(idVuelo: number | undefined) {
  if (!idVuelo) return;
  this.router.navigate(['/alumno/vuelo/detalle', idVuelo]);
}

}
