import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvionetaService, Avioneta } from './services/avioneta.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>✈️ Lista de Avionetas</h1>
    <ul *ngIf="avionetas.length; else vacio">
      <li *ngFor="let a of avionetas">
        {{ a.codigo }} - {{ a.modelo }} ({{ a.estado }})
      </li>
    </ul>
    <ng-template #vacio><p>No hay avionetas registradas.</p></ng-template>
  `
})
export class App implements OnInit {
  avionetas: Avioneta[] = [];

  constructor(private avionetaService: AvionetaService) {}

  ngOnInit() {
    this.avionetaService.getAvionetas().subscribe({
      next: (data) => this.avionetas = data,
      error: (err) => console.error('Error al cargar avionetas:', err)
    });
  }
}
