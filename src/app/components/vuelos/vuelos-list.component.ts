import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VuelosService } from '../../services/vuelos.service';
import { Vuelo } from '../../models/vuelos.model';

@Component({
  selector: 'app-vuelos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="dashboard-container">
  <div class="header">
    <h2>Vuelos</h2>
    <button class="btn-primary" (click)="crear()">Nuevo Vuelo</button>
  </div>

  <div class="filters">
    <input type="text" placeholder="Buscar por Alumno, Tutor o Avioneta..." [(ngModel)]="filtro" (input)="aplicarFiltros()" />
    <select [(ngModel)]="estadoFiltro" (change)="aplicarFiltros()">
      <option value="">Todos</option>
      <option value="Programado">Programado</option>
      <option value="Completado">Completado</option>
      <option value="Cancelado">Cancelado</option>
    </select>
  </div>

  <div class="table-container">
    <table>
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
        <tr *ngFor="let vuelo of paginadoVuelos">
          <td>{{ vuelo.nombreAlumno || '-' }}</td>
          <td>{{ vuelo.nombreTutor || '-' }}</td>
          <td>{{ vuelo.codigoAvioneta || '-' }}</td>
          <td>{{ vuelo.fecha || '-' }}</td>
          <td>{{ vuelo.horaInicio || '-' }}</td>
          <td>{{ vuelo.horaFin || '-' }}</td>
          <td>{{ vuelo.nombreEspacio || '-' }}</td>
          <td [ngClass]="estadoClass(vuelo.estado)">{{ vuelo.estado || '-' }}</td>
          <td>{{ vuelo.observacion || '-' }}</td>
          <td>
            <button class="btn-edit" (click)="editar(vuelo.idVuelo)">Editar</button>
          </td>
        </tr>
        <tr *ngIf="paginadoVuelos.length === 0">
          <td colspan="10" class="no-results">No hay resultados</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="pagination" *ngIf="totalPaginas > 1">
    <button (click)="cambiarPagina(currentPage-1)" [disabled]="currentPage===1">Anterior</button>
    <span>Página {{ currentPage }} de {{ totalPaginas }}</span>
    <button (click)="cambiarPagina(currentPage+1)" [disabled]="currentPage===totalPaginas">Siguiente</button>
  </div>
</div>
  `,
  styles: [`
.dashboard-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem;
  padding-left: 80px; /* Ajustá el valor */

  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h2 { margin: 0; color: #333; }

.filters {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
  justify-content: flex-end;
}

.filters input, .filters select {
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: all 0.2s;
}

.filters input:focus, .filters select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
}

.table-container { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

th, td { padding: 0.6rem 0.8rem; text-align: left; }

th {
  background: #007bff;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
}

tbody tr { transition: background 0.2s; cursor: default; }
tbody tr:hover { background: #e6f0ff; }

td.Programado { color: #007bff; font-weight: 600; }
td.Completado { color: green; font-weight: 600; }
td.Cancelado { color: red; font-weight: 600; }

.no-results { text-align: center; padding: 1rem; color: #666; }

button {
  cursor: pointer;
  border-radius: 6px;
  border: none;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-primary:hover { background-color: #0056b3; }

.btn-edit {
  background-color: #ffc107;
  color: #333;
}
.btn-edit:hover { background-color: #e0a800; }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination button {
  background-color: #007bff;
  color: white;
  padding: 0.4rem 0.8rem;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
  `]
})
export class VuelosListComponent implements OnInit {

  vuelos: Vuelo[] = [];
  paginadoVuelos: Vuelo[] = [];

  filtro = '';
  estadoFiltro = '';
  currentPage = 1;
  pageSize = 5;
  totalPaginas = 1;

  constructor(private vuelosService: VuelosService, private router: Router) {}

  ngOnInit(): void { this.cargarVuelos(); }

  cargarVuelos() {
    this.vuelosService.listar().subscribe(data => {
      // ORDENAR POR FECHA DESCENDENTE
      this.vuelos = data.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.horaInicio || '00:00'}`);
        const fechaB = new Date(`${b.fecha}T${b.horaInicio || '00:00'}`);
        return fechaB.getTime() - fechaA.getTime();
      });

      this.aplicarFiltros();
    });
  }


  aplicarFiltros() {
    let temp = this.vuelos;

    if (this.filtro) {
      temp = temp.filter(v =>
        (v.nombreAlumno?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (v.nombreTutor?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (v.codigoAvioneta?.toLowerCase() ?? '').includes(this.filtro.toLowerCase())
      );
    }

    if (this.estadoFiltro) {
      temp = temp.filter(v => v.estado === this.estadoFiltro);
    }

    this.totalPaginas = Math.ceil(temp.length / this.pageSize) || 1;
    this.currentPage = 1;
    this.paginadoVuelos = temp.slice(0, this.pageSize);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.currentPage = n;

    let temp = this.vuelos;

    if (this.filtro) {
      temp = temp.filter(v =>
        (v.nombreAlumno?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (v.nombreTutor?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (v.codigoAvioneta?.toLowerCase() ?? '').includes(this.filtro.toLowerCase())
      );
    }

    if (this.estadoFiltro) {
      temp = temp.filter(v => v.estado === this.estadoFiltro);
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.paginadoVuelos = temp.slice(start, start + this.pageSize);
  }

  crear() { this.router.navigate(['admin/vuelos/nuevo']); }

  editar(id?: number) { if (id) this.router.navigate(['admin/vuelos/editar', id]); }

  estadoClass(estado: string | undefined) { return estado ?? ''; }

}