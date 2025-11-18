import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AlumnoService } from '../../../services/alumno.service';
import { Rendimiento } from '../../../models/rendimiento.model';
import { Vuelo } from '../../../models/vuelos.model';

@Component({
  selector: 'app-detalle-vuelo-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vuelo-detalle.html',
  styleUrls: ['./vuelo-detalle.css']
})
export class DetalleVueloAlumnoComponent implements OnInit {

  idAlumno!: number;
  idVuelo!: number;

  vuelo!: Vuelo | null;
  rendimiento!: Rendimiento | null;

  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private alumnoService: AlumnoService
  ) {}

  ngOnInit(): void {
    this.idAlumno = Number(localStorage.getItem('id_usuario'));
    this.idVuelo = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    // VUELO
    this.alumnoService.obtenerVueloEspecifico(this.idAlumno, this.idVuelo)
      .subscribe(v => {
        this.vuelo = v;
      });

    // RENDIMIENTO
    this.alumnoService.obtenerRendimiento(this.idVuelo)
  .subscribe(r => {
    this.rendimiento = r as Rendimiento;  // ⭐ CAST seguro
    this.cargando = false;
  });

  }
}
