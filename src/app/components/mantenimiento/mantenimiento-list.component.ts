import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { Mantenimiento } from '../../models/mantenimiento.model';

@Component({
  selector: 'app-mantenimiento-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="dashboard-container">
  <div class="header">
    <h2>Lista de Mantenimientos</h2>
    <button class="btn-primary" (click)="nuevo()">Nuevo Mantenimiento</button>
  </div>

  <div class="filters">
    <input type="text" placeholder="Buscar por Avioneta o Tipo..." [(ngModel)]="filtro" (input)="aplicarFiltros()" />
    <select [(ngModel)]="estadoFiltro" (change)="aplicarFiltros()">
      <option value="">Todos</option>
      <option value="En_proceso">En Proceso</option>
      <option value="Finalizado">Finalizado</option>
      <option value="Pausado">Pausado</option>
    </select>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Avioneta</th>
          <th>Descripción</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let m of paginadoMantenimientos">
          <td>{{ m.avioneta?.codigo ?? '-' }}</td>
          <td>{{ m.descripcion ?? '-' }}</td>
          <td>{{ m.tipo ?? '-' }}</td>
          <td [ngClass]="estadoClass(m.estado)">{{ m.estado ?? '-' }}</td>
          <td>{{ m.fechaInicio ? (m.fechaInicio | date:'short') : '-' }}</td>
          <td>{{ m.fechaFin ? (m.fechaFin | date:'short') : '-' }}</td>
          <td>
            <button class="btn-edit" (click)="editar(m)">Editar</button>
          </td>
        </tr>
        <tr *ngIf="paginadoMantenimientos.length === 0">
          <td colspan="7" class="no-results">No hay resultados</td>
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
  max-width: 950px;
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

td.En_proceso { color: #007bff; font-weight: 600; }
td.Finalizado { color: green; font-weight: 600; }
td.Pausado { color: orange; font-weight: 600; }

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
export class MantenimientoListComponent implements OnInit {

  mantenimientos: Mantenimiento[] = [];
  paginadoMantenimientos: Mantenimiento[] = [];

  filtro = '';
  estadoFiltro = '';
  currentPage = 1;
  pageSize = 5;
  totalPaginas = 1;

  constructor(
    private mantenimientoService: MantenimientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.mantenimientoService.listar().subscribe((m: Mantenimiento[]) => {

      // ORDENAR POR FECHA MÁS RECIENTE
      this.mantenimientos = m.sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
      );

      this.aplicarFiltros();
    });
  }


  aplicarFiltros() {
    let temp = [...this.mantenimientos];

    // mantener orden por fecha reciente
    temp = temp.sort((a, b) =>
      new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    );

    if (this.filtro) {
      temp = temp.filter(m =>
        (m.avioneta?.codigo?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (m.tipo?.toLowerCase() ?? '').includes(this.filtro.toLowerCase())
      );
    }

    if (this.estadoFiltro) {
      temp = temp.filter(m => m.estado === this.estadoFiltro);
    }

    this.totalPaginas = Math.ceil(temp.length / this.pageSize) || 1;
    this.currentPage = 1;
    this.paginadoMantenimientos = temp.slice(0, this.pageSize);
  }


  cambiarPagina(n: number) {
    if (n < 1 || n > this.totalPaginas) return;
    this.currentPage = n;

    let temp = this.mantenimientos;

    if (this.filtro) {
      temp = temp.filter(m =>
        (m.avioneta?.codigo?.toLowerCase() ?? '').includes(this.filtro.toLowerCase()) ||
        (m.tipo?.toLowerCase() ?? '').includes(this.filtro.toLowerCase())
      );
    }

    if (this.estadoFiltro) {
      temp = temp.filter(m => m.estado === this.estadoFiltro);
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.paginadoMantenimientos = temp.slice(start, start + this.pageSize);
  }

  nuevo() {
    this.router.navigate(['/admin/mantenimientos/form']);
  }

  editar(m: Mantenimiento) {
    if (m.idMantenimiento !== undefined) {
      this.router.navigate(['/admin/mantenimientos/form', m.idMantenimiento]);
    }
  }

  estadoClass(estado: string | undefined) {
    return estado ?? '';
  }
}
