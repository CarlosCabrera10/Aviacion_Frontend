import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EspacioVueloService } from '../../services/espacioVuelo.service';
import { EspacioVuelo } from '../../models/espacioVuelo.model';

@Component({
  selector: 'app-espacios-list',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="espacios-list-container">
  <h2>Espacios de Vuelo</h2>

  <button (click)="nuevo()">Nuevo Espacio</button>

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
      <tr *ngFor="let e of espacios">
        <td>{{ e.nombre }}</td>
        <td>{{ e.tipo }}</td>
        <td>{{ e.ubicacion }}</td>
        <td>{{ e.habilitado ? 'Sí' : 'No' }}</td>
        <td>
          <button (click)="editar(e.idEspacioVuelo!)">Editar</button>
          <button *ngIf="e.habilitado" (click)="desactivar(e.idEspacioVuelo!)">Desactivar</button>
          <button *ngIf="!e.habilitado" (click)="activar(e.idEspacioVuelo!)">Activar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  `,
  styles: [`
.espacios-list-container { max-width: 800px; margin: 2rem auto; }
h2 { color: #004e92; margin-bottom: 1rem; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
button { margin-right: 0.5rem; padding: 0.3rem 0.8rem; border-radius: 6px; border: none; cursor: pointer; }
button:first-child { background: #004e92; color: white; }
button:nth-child(2) { background: red; color: white; }
button:nth-child(3) { background: green; color: white; }
  `]
})
export class EspaciosVueloListComponent implements OnInit {

  espacios: EspacioVuelo[] = [];

  constructor(
    private espaciosService: EspacioVueloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEspacios();
  }

  cargarEspacios() {
    this.espaciosService.listar().subscribe({
      next: data => this.espacios = data,
      error: err => alert('Error cargando espacios')
    });
  }

  nuevo() {
    this.router.navigate(['/admin/espacios/nuevo']);
  }

  editar(id: number) {
    this.router.navigate([`/admin/espacios/${id}`]);
  }

  desactivar(id: number) {
    this.espaciosService.desactivar(id).subscribe({
      next: () => this.cargarEspacios(),
      error: err => alert('Error desactivando espacio')
    });
  }

  activar(id: number) {
    this.espaciosService.desactivar(id).subscribe({
      next: () => this.cargarEspacios(),
      error: err => alert('Error activando espacio')
    });
  }
}
