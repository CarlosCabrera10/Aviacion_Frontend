import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VuelosService } from '../../services/vuelos.service';
import { Vuelo } from '../../models/vuelos.model';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-vuelos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Vuelos</h2>
      <button class="btn btn-primary mb-3" routerLink="/vuelos/nuevo">Nuevo Vuelo</button>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Tutor</th>
            <th>Avioneta</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Observación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let vuelo of vuelos">
            <td>{{ vuelo.nombreAlumno }}</td>
            <td>{{ vuelo.nombreTutor }}</td>
            <td>{{ vuelo.codigoAvioneta }}</td>
            <td>{{ vuelo.fecha }}</td>
            <td>{{ vuelo.hora }}</td>
            <td>{{ vuelo.estado }}</td>
            <td>{{ vuelo.observacion }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" (click)="editar(vuelo.idVuelo)">Editar</button>
              <button class="btn btn-sm btn-danger" (click)="eliminar(vuelo.idVuelo)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class VuelosListComponent implements OnInit {
  vuelos: Vuelo[] = [];

  constructor(private vuelosService: VuelosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarVuelos();
  }

  cargarVuelos() {
    this.vuelosService.listar().subscribe(data => this.vuelos = data);
  }

  editar(id?: number) {
    if (id) this.router.navigate(['/vuelos/editar', id]);
  }

  eliminar(id?: number) {
    if (!id) return;
    if (confirm('¿Desea eliminar este vuelo?')) {
      this.vuelosService.eliminar(id).subscribe(() => this.cargarVuelos());
    }
  }
}
