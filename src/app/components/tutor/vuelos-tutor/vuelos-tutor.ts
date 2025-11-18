import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VuelosService } from '../../../services/vuelos.service';
import { Vuelo } from '../../../models/vuelos.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vuelos-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vuelos-tutor.html',
  styleUrls: ['./vuelos-tutor.css']
})
export class VuelosTutorComponent implements OnInit {

  vuelos: Vuelo[] = [];
  totalVuelos = 0;

  // filtros
  filtroAlumno: string = '';
  filtroFecha: string = '';
  filtroEstado: string = '';

  // paginación
  paginaActual = 0;
  size = 25;

  cargando = true;

  constructor(private vuelosService: VuelosService) {}

  ngOnInit(): void {
    this.cargarVuelosDelDia();
  }

  cargarVuelosDelDia() {
    const hoy = new Date().toISOString().split('T')[0];
    this.filtroFecha = hoy;
    this.buscar();
  }

 buscar() {
  this.cargando = true;

  const idTutor = Number(localStorage.getItem('id_usuario'));

  this.vuelosService.listarPorTutor(idTutor).subscribe({
    next: (data) => {
      let filtrados = data;

      // Filtro Alumno
      if (this.filtroAlumno.trim() !== '') {
        filtrados = filtrados.filter(v =>
          v.nombreAlumno?.toLowerCase().includes(this.filtroAlumno.toLowerCase())
        );
      }

      // Filtro Estado
      if (this.filtroEstado !== '') {
        filtrados = filtrados.filter(v => v.estado === this.filtroEstado);
      }

      // Filtro Fecha
      if (this.filtroFecha !== '') {
        filtrados = filtrados.filter(v => v.fecha === this.filtroFecha);
      }

      this.totalVuelos = filtrados.length;

      const start = this.paginaActual * this.size;
      const end = start + this.size;
      this.vuelos = filtrados.slice(start, end);

      this.cargando = false;
    },

    error: () => {
      this.cargando = false;
      Swal.fire("Error", "No se pudieron cargar los vuelos", "error");
    }
  });
}

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0) return;
    if (nuevaPagina > Math.floor(this.totalVuelos / this.size)) return;
    this.paginaActual = nuevaPagina;
    this.buscar();
  }

  limpiarFiltros() {
    this.filtroAlumno = '';
    this.filtroFecha = '';
    this.filtroEstado = '';
    this.paginaActual = 0;
    this.buscar();
  }
}
