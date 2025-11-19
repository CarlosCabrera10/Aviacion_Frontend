import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 AÑADIR ESTO

import { AlumnoService } from '../../../services/alumno.service';

@Component({
  selector: 'app-notificaciones-alumno',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule          // 👈 Y AÑADIRLO AQUÍ
  ],
  templateUrl: './notificaciones-alumno.html',
  styleUrls: ['./notificaciones-alumno.css']
})
export class NotificacionesAlumnoComponent implements OnInit {

  idAlumno!: number;

  notificaciones: any[] = [];     // TODAS desde backend
  filtradas: any[] = [];          // FILTRADAS (por fecha/estado)
  pagina: any[] = [];             // PÁGINA ACTUAL PARA MOSTRAR

  cargando = true;

  // FILTROS
  filtroEstado = '';
  fechaInicio = '';
  fechaFin = '';

  // PAGINACIÓN
  paginaActual = 0;
  size = 10;
  totalPaginas = 1;

  constructor(private alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.idAlumno = Number(localStorage.getItem('id_usuario'));
    this.cargar();
  }

  cargar() {
    this.cargando = true;

    this.alumnoService.obtenerNotificaciones(this.idAlumno).subscribe(n => {
      this.notificaciones = n;

      // ordenar descendente
      this.notificaciones.sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      // mostrar últimas 10 por defecto
      this.filtradas = [...this.notificaciones];
      this.paginaActual = 0;

      this.paginar();

      this.cargando = false;
    });
  }

  /* ============================
       FILTROS
  ============================ */

  aplicarFiltros() {

    this.filtradas = this.notificaciones.filter(n => {

      // FILTRO ESTADO
      const estadoOk =
        !this.filtroEstado ||
        (this.filtroEstado === 'leida' && n.leida === true) ||
        (this.filtroEstado === 'no-leida' && n.leida === false);

      let fechaOk = true;

      // FILTRO FECHAS
      if (this.fechaInicio) {
        fechaOk = fechaOk && n.fecha >= this.fechaInicio;
      }

      if (this.fechaFin) {
        fechaOk = fechaOk && n.fecha <= this.fechaFin + "T23:59:59";
      }

      return estadoOk && fechaOk;
    });

    this.paginaActual = 0;
    this.paginar();
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtroEstado = '';

    this.filtradas = [...this.notificaciones];
    this.paginaActual = 0;

    this.paginar();
  }

  /* ============================
       PAGINACIÓN
  ============================ */

  paginar() {
    this.totalPaginas = Math.max(1, Math.ceil(this.filtradas.length / this.size));

    const start = this.paginaActual * this.size;
    const end = start + this.size;

    this.pagina = this.filtradas.slice(start, end);
  }

  cambiarPagina(dir: number) {
    let nueva = this.paginaActual + dir;

    if (nueva < 0) nueva = 0;
    if (nueva >= this.totalPaginas) nueva = this.totalPaginas - 1;

    this.paginaActual = nueva;
    this.paginar();
  }

  irPagina(num: number) {
    this.paginaActual = num;
    this.paginar();
  }

  /* ============================
       MARCAR COMO LEÍDA
  ============================ */
  marcarLeida(idNoti: number) {
    this.alumnoService.marcarLeida(idNoti).subscribe(() => {

      this.notificaciones = this.notificaciones.map(n =>
        n.idNotificacion === idNoti ? { ...n, leida: true } : n
      );

      this.aplicarFiltros();
    });
  }
}
