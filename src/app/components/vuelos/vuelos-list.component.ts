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
<div class="vuelos-container">
  <h2>Vuelos</h2>
  <div class="actions">
    <button class="btn btn-primary" (click)="crear()">Nuevo</button>
  </div>

  <table class="table table-striped mt-3">
    <thead>
      <tr>
        <th>Alumno</th>
        <th>Tutor</th>
        <th>Avioneta</th>
        <th>Fecha</th>
        <th>Hora Inicio</th>
        <th>Hora Fin</th>
        <th>Espacio</th>
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
        <td>{{ vuelo.horaInicio }}</td>
        <td>{{ vuelo.horaFin }}</td>
        <td>{{ vuelo.nombreEspacio }}</td>
        <td>{{ vuelo.estado }}</td>
        <td>{{ vuelo.observacion }}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" (click)="editar(vuelo.idVuelo)">Editar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  `,
  styles: [`
.vuelos-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  font-family: Arial, sans-serif;
  position: relative;
  z-index: 10; /* Para que no lo tape el dashboard */
}
.vuelos-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #004e92;
  font-weight: 700;
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.table th, .table td {
  vertical-align: middle;
}
`]
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
    if (id) this.router.navigate(['admin/vuelos/editar', id]);
  }

  crear() {
    this.router.navigate(['admin/vuelos/nuevo']);
  }

}
