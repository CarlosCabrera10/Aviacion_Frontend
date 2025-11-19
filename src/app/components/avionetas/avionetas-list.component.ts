import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AvionetasService } from '../../services/avionetas.service';
import { Avioneta } from '../../models/avioneta.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avionetas-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
<div class="dashboard-container">
  <div class="header">
    <h2>Lista de Avionetas</h2>
    <button class="btn-primary" (click)="nueva()">Agregar Avioneta</button>
  </div>

  <div class="filters">
    <input type="text" placeholder="Buscar por código o modelo..." [(ngModel)]="filtro" (input)="aplicarFiltros()"/>
    <select [(ngModel)]="estadoFiltro" (change)="aplicarFiltros()">
      <option value="">Todos</option>
      <option value="Activo">Activo</option>
      <option value="Mantenimiento">Mantenimiento</option>
    </select>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Modelo</th>
          <th>Horas Vuelo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of paginadoAvionetas">
          <td>{{ a.codigo }}</td>
          <td>{{ a.modelo }}</td>
          <td>{{ a.horasVuelo }}</td>
          <td [ngClass]="{'activo': a.estado === 'Activo', 'inactivo': a.estado === 'Mantenimiento'}">{{ a.estado }}</td>
          <td>
            <button class="btn-edit" (click)="editar(a.idAvioneta!)">Editar</button>
          </td>
        </tr>
        <tr *ngIf="paginadoAvionetas.length === 0">
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

td.activo { color: green; font-weight: 600; }
td.inactivo { color: red; font-weight: 600; }

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
export class AvionetasListComponent implements OnInit {
  avionetas: Avioneta[] = [];
  paginadoAvionetas: Avioneta[] = [];

  filtro = '';
  estadoFiltro = '';
  currentPage = 1;
  pageSize = 5;
  totalPaginas = 1;

  constructor(
    private avionetasService: AvionetasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.avionetasService.listar().subscribe(data => {
      this.avionetas = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    let temp = this.avionetas;
    if (this.filtro) {
      temp = temp.filter(a =>
        a.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
        a.modelo.toLowerCase().includes(this.filtro.toLowerCase())
      );
    }
    if (this.estadoFiltro) {
      temp = temp.filter(a => a.estado === this.estadoFiltro);
    }
    this.totalPaginas = Math.ceil(temp.length / this.pageSize) || 1;
    this.currentPage = 1;
    this.paginadoAvionetas = temp.slice(0, this.pageSize);
  }

  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.currentPage = n;
    let temp = this.avionetas;
    if (this.filtro) temp = temp.filter(a =>
      a.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      a.modelo.toLowerCase().includes(this.filtro.toLowerCase())
    );
    if (this.estadoFiltro) temp = temp.filter(a => a.estado === this.estadoFiltro);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginadoAvionetas = temp.slice(start, start + this.pageSize);
  }

  nueva() {
    this.router.navigate(['/admin/avionetas/nueva']);
  }

  editar(id: number) {
    this.router.navigate(['/admin/avionetas/editar', id]);
  }
}
