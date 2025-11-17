import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { VuelosService } from '../../../services/vuelos.service';
import { RendimientoService } from '../../../services/rendimiento.service';

import { Vuelo } from '../../../models/vuelos.model';
import { Rendimiento } from '../../../models/rendimiento.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-vuelo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-vuelo.html',
  styleUrls: ['./editar-vuelo.css']
})
export class EditarVueloComponent implements OnInit {

  idVuelo!: number;

  vuelo: Vuelo | null = null;
  rendimiento: Rendimiento | null = null;

  mostrarRendimiento = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vuelosService: VuelosService,
    private rendimientoService: RendimientoService
  ) {}

 estadoOriginal!: string;   // estado real del backend

ngOnInit(): void {
  this.idVuelo = Number(this.route.snapshot.paramMap.get('id'));
  this.cargarVuelo();
  this.cargarRendimiento();
}

cargarVuelo() {
  this.vuelosService.obtenerPorId(this.idVuelo).subscribe({
    next: (v) => {
      this.vuelo = v;
      this.estadoOriginal = v.estado ?? 'Programado'; // 👉 GUARDAMOS EL ESTADO ORIGINAL

      // mostrar rendimiento solo si ya venía completado
      this.mostrarRendimiento = v.estado === 'Completado';
    },
    error: () => Swal.fire("Error", "No se pudo cargar el vuelo", "error")
  });
}

  cargarRendimiento() {
    this.rendimientoService.obtenerPorVuelo(this.idVuelo).subscribe({
      next: (r) => {
        this.rendimiento = r || {
          idVuelo: this.idVuelo,
          tecnicaAterrizaje: 0,
          maniobras: 0,
          comunicacionRadio: 0,
          seguimientoInstrucciones: 0,
          puntualidad: 0,
          comportamiento: 0,
          comentarios: ''
        };
      }
    });
  }

  guardarVuelo() {
  if (!this.vuelo) return;

  const estadoActual = this.vuelo.estado ?? '';
  const estadoAnterior = this.estadoOriginal ?? '';

  // 1️⃣ Si el vuelo ya estaba COMPLETADO → NO permitir cambiar estado
  if (estadoAnterior === 'Completado' && estadoActual !== 'Completado') {
    Swal.fire(
      "No permitido",
      "No puedes cambiar el estado de un vuelo que ya fue completado.",
      "warning"
    );
    this.vuelo.estado = 'Completado'; // forzar que no cambie
    return;
  }

  // 2️⃣ Si está CANCELADO → comentario obligatorio
  if (estadoActual === 'Cancelado') {
    if (!this.vuelo.observacion || this.vuelo.observacion.trim() === '') {
      Swal.fire(
        "Advertencia",
        "Debes ingresar una razón de cancelación.",
        "warning"
      );
      return;
    }
  }

  // 3️⃣ Si se cambia o está en COMPLETADO → requerir rendimiento completo
  if (estadoActual === 'Completado') {

    this.mostrarRendimiento = true;

    if (!this.rendimiento) {
      Swal.fire("Advertencia", "Debes llenar el rendimiento del alumno.", "warning");
      return;
    }

    // Normalizamos valores
    const campos: number[] = [
      this.rendimiento.tecnicaAterrizaje ?? 0,
      this.rendimiento.maniobras ?? 0,
      this.rendimiento.comunicacionRadio ?? 0,
      this.rendimiento.seguimientoInstrucciones ?? 0,
      this.rendimiento.puntualidad ?? 0,
      this.rendimiento.comportamiento ?? 0
    ];

    const invalido = campos.some(v => v < 1 || v > 10 || isNaN(v));
    if (invalido) {
      Swal.fire("Advertencia", "Todos los valores deben estar entre 1 y 10.", "warning");
      return;
    }
  }

  // 4️⃣ Guardar cambios del vuelo
  this.vuelosService.actualizar(this.idVuelo, this.vuelo).subscribe({
    next: () => {

      // Si quedó completado → actualizamos estado original
      if (estadoActual === 'Completado') {
        this.estadoOriginal = 'Completado';
      }

      Swal.fire({
        icon: 'success',
        title: 'Vuelo actualizado correctamente',
        timer: 1500,
        showConfirmButton: false
      });
    },

    error: () => {
      Swal.fire("Error", "No se pudo actualizar el vuelo.", "error");
    }
  });
}


onEstadoChange() {
  if (this.estadoOriginal === 'Completado' && this.vuelo?.estado !== 'Completado') {
    Swal.fire("No permitido", "Un vuelo ya completado no puede cambiar de estado.", "warning");
    this.vuelo!.estado = 'Completado'; // vuelve al original
  }

  // si cambia a completado, mostrar formulario
  this.mostrarRendimiento = this.vuelo?.estado === 'Completado';
}

guardarRendimiento() {
  if (!this.rendimiento) return;

  // Normalizamos los valores a número, usando 0 si vienen undefined/null
  const campos: number[] = [
    this.rendimiento.tecnicaAterrizaje ?? 0,
    this.rendimiento.maniobras ?? 0,
    this.rendimiento.comunicacionRadio ?? 0,
    this.rendimiento.seguimientoInstrucciones ?? 0,
    this.rendimiento.puntualidad ?? 0,
    this.rendimiento.comportamiento ?? 0
  ];

  const invalido = campos.some(v => v < 1 || v > 10 || isNaN(v));

  if (invalido) {
    Swal.fire("Advertencia", "Los valores deben estar entre 1 y 10.", "warning");
    return;
  }

  this.rendimientoService.guardar(this.idVuelo, this.rendimiento).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Rendimiento guardado',
        timer: 1500,
        showConfirmButton: false
      });
    },
    error: () => Swal.fire("Error", "No se pudo guardar el rendimiento", "error")
  });
}

}