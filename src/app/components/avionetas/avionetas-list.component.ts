import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AvionetasService } from '../../services/avionetas.service';
import { Avioneta } from '../../models/avioneta.model';

@Component({
  selector: 'app-avionetas-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Lista de Avionetas</h2>

      <button (click)="nueva()">Agregar Avioneta</button>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Modelo</th>
            <th>Horas de Vuelo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let avioneta of avionetas">
            <td>{{ avioneta.codigo }}</td>
            <td>{{ avioneta.modelo }}</td>
            <td>{{ avioneta.horasVuelo }}</td>
            <td>{{ avioneta.estado }}</td>
            <td>
              <button (click)="editar(avioneta.idAvioneta!)">Editar</button>
              <button (click)="eliminar(avioneta.idAvioneta!)" class="delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="mensajeError" class="error">{{ mensajeError }}</div>
      <div *ngIf="mensajeExito" class="success">{{ mensajeExito }}</div>
    </div>
  `,
  styles: [`
    .container { padding: 1.5rem; max-width: 800px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 3px 8px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.8rem; border-bottom: 1px solid #ddd; text-align: left; }
    button { margin-right: 5px; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; }
    .delete { background: #dc3545; color: white; }
    .error { color: #d9534f; font-weight: bold; margin-top: 1rem; }
    .success { color: #28a745; font-weight: bold; margin-top: 1rem; }
  `]
})
export class AvionetasListComponent implements OnInit {
  avionetas: Avioneta[] = [];
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private avionetasService: AvionetasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.avionetasService.listar().subscribe({
      next: (data) => this.avionetas = data,
      error: () => this.mensajeError = 'Error al cargar las avionetas.'
    });
  }

  nueva() {
    this.router.navigate(['admin/avionetas/nueva']);
  }

  editar(id: number) {
    this.router.navigate(['admin/avionetas/editar', id]);
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta avioneta?')) {
      this.avionetasService.eliminar(id).subscribe({
        next: () => {
          this.mensajeExito = 'Avioneta eliminada correctamente.';
          this.cargar();
        },
        error: () => this.mensajeError = 'Error al eliminar la avioneta.'
      });
    }
  }
}
