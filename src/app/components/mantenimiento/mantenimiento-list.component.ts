import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { Mantenimiento } from '../../models/mantenimiento.model';


@Component({
  selector: 'app-mantenimiento-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="container">
  <h2>Lista de Mantenimientos</h2>
  <button routerLink="/admin/mantenimientos/form">Nuevo Mantenimiento</button>

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
      <tr *ngFor="let m of mantenimientos">
        <td>{{ m.avioneta?.codigo }}</td>
        <td>{{ m.descripcion }}</td>
        <td>{{ m.tipo }}</td>
        <td>{{ m.estado }}</td>
        <td>{{ m.fechaInicio | date:'short' }}</td>
        <td>{{ m.fechaFin ? (m.fechaFin | date:'short') : '-' }}</td>
        <td>
          <button (click)="editar(m)">Editar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  `,
  styles: [`
.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  font-family: Arial, sans-serif;
}
h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #004e92;
}
button {
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 6px;
  background-color: #004e92;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background-color: #003366;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.6rem;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
  `]
})
export class MantenimientoListComponent implements OnInit {

  mantenimientos: Mantenimiento[] = [];

  constructor(
    private mantenimientoService: MantenimientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.mantenimientoService.listar().subscribe((m: Mantenimiento[]) => {
      this.mantenimientos = m;
    });
  }

  editar(m: Mantenimiento) {
    if (m.idMantenimiento !== undefined) {
      this.router.navigate(['/admin/mantenimientos/form', m.idMantenimiento]);
    }
  }
}
