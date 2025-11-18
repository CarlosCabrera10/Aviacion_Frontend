import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AvionetasService } from '../../services/avionetas.service';
import { Avioneta } from '../../models/avioneta.model';

@Component({
  selector: 'app-avionetas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<div class="container">
  <h2>Lista de Avionetas</h2>
  <button (click)="nueva()">Agregar Avioneta</button>

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
      <tr *ngFor="let a of avionetas">
        <td>{{ a.codigo }}</td>
        <td>{{ a.modelo }}</td>
        <td>{{ a.horasVuelo }}</td>
        <td>{{ a.estado }}</td>
        <td>
          <button (click)="editar(a.idAvioneta!)">Editar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  `,
  styles: [`
.container { padding: 1.5rem; max-width: 900px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 3px 8px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { padding: 0.8rem; border-bottom: 1px solid #ddd; text-align: left; }
button { margin-right: 5px; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; }
  `]
})
export class AvionetasListComponent implements OnInit {
  avionetas: Avioneta[] = [];

  constructor(
    private avionetasService: AvionetasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.avionetasService.listar().subscribe(data => this.avionetas = data);
  }

  nueva() {
    this.router.navigate(['/admin/avionetas/nueva']);
  }

  editar(id: number) {
    this.router.navigate(['/admin/avionetas/editar', id]);
  }
}
