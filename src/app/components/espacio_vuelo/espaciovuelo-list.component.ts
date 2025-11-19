import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EspacioVueloService } from '../../services/espacioVuelo.service';
import { EspacioVuelo } from '../../models/espacioVuelo.model';

@Component({
  selector: 'app-espacios-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="dashboard-container">
  <div class="header">
    <h2>Espacios de Vuelo</h2>
    <button class="btn-primary" (click)="nuevo()">Nuevo Espacio</button>
  </div>

  <div class="filters">
    <input type="text" placeholder="Buscar por nombre o tipo..." [(ngModel)]="filtro" (input)="aplicarFiltros()"/>
    <select [(ngModel)]="estadoFiltro" (change)="aplicarFiltros()">
      <option value="">Todos</option>
      <option value="true">Habilitado</option>
      <option value="false">Deshabilitado</option>
    </select>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Ubicación</th>
          <th>Habilitado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let e of paginadoEspacios">
          <td>{{ e.nombre }}</td>
          <td>{{ e.tipo }}</td>
          <td>{{ e.ubicacion }}</td>
          <td [ngClass]="e.habilitado ? 'habilitado' : 'deshabilitado'">
            {{ e.habilitado ? 'Sí' : 'No' }}
          </td>
          <td>
            <button class="btn-edit" (click)="editar(e.idEspacioVuelo!)">Editar</button>
            <button *ngIf="e.habilitado" class="btn-desactivar" (click)="desactivar(e.idEspacioVuelo!)">Desactivar</button>
            <button *ngIf="!e.habilitado" class="btn-activar" (click)="activar(e.idEspacioVuelo!)">Activar</button>
          </td>
        </tr>
        <tr *ngIf="paginadoEspacios.length === 0">
          <td colspan="5" class="no-results">No hay resultados</td>
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
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0;
  color: #333;
}

.filters {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
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

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

th, td {
  padding: 0.8rem 1rem;
  text-align: left;
}

th {
  background: #007bff;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
}

tbody tr {
  transition: background 0.2s;
  cursor: default;
}

tbody tr:hover {
  background: #e6f0ff;
}

td.habilitado { color: green; font-weight: 600; }
td.deshabilitado { color: red; font-weight: 600; }

.no-results {
  text-align: center;
  padding: 1rem;
  color: #666;
}

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

.btn-activar {
  background-color: #28a745;
  color: white;
}

.btn-activar:hover { background-color: #218838; }

.btn-desactivar {
  background-color: #dc3545;
  color: white;
}

.btn-desactivar:hover { background-color: #c82333; }

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
export class EspaciosVueloListComponent implements OnInit {

  espacios: EspacioVuelo[] = [];
  paginadoEspacios: EspacioVuelo[] = [];

  filtro = '';
  estadoFiltro = '';
  currentPage = 1;
  pageSize = 5;
  totalPaginas = 1;

  constructor(
    private espaciosService: EspacioVueloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEspacios();
  }

  cargarEspacios() {
    this.espaciosService.listar().subscribe({
      next: data => {
        this.espacios = data;
        this.aplicarFiltros();
      },
      error: err => alert('Error cargando espacios')
    });
  }

  aplicarFiltros() {
    let temp = this.espacios;

    if (this.filtro) {
      temp = temp.filter(e =>
        (e.nombre?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (e.tipo?.toLowerCase() ?? '').includes(this.filtro.toLowerCase())
      );
    }

    if (this.estadoFiltro) {
      const habilitado = this.estadoFiltro === 'true';
      temp = temp.filter(e => e.habilitado === habilitado);
    }

    this.totalPaginas = Math.ceil(temp.length / this.pageSize) || 1;
    this.currentPage = 1;
    this.paginadoEspacios = temp.slice(0, this.pageSize);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.currentPage = n;

    let temp = this.espacios;

    if (this.filtro) {
      temp = temp.filter(e =>
        (e.nombre?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (e.tipo?.toLowerCase() ?? '').includes(this.filtro.toLowerCase())
      );
    }

    if (this.estadoFiltro) {
      const habilitado = this.estadoFiltro === 'true';
      temp = temp.filter(e => e.habilitado === habilitado);
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.paginadoEspacios = temp.slice(start, start + this.pageSize);
  }

  nuevo() {
    this.router.navigate(['/admin/espacios/nuevo']);
  }

  editar(id: number) {
    this.router.navigate([`/admin/espacios/editar/${id}`]);
  }

  desactivar(id: number) {
    this.espaciosService.desactivar(id).subscribe({
      next: () => this.cargarEspacios(),
      error: () => alert('Error desactivando espacio')
    });
  }

  activar(id: number) {
    this.espaciosService.activar(id).subscribe({
      next: () => this.cargarEspacios(),
      error: () => alert('Error activando espacio')
    });
  }
}
