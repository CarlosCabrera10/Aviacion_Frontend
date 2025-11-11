import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvionetasService } from '../../services/avionetas.service';
import { Avioneta } from '../../models/avioneta.model';

@Component({
  selector: 'app-avionetas-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None, // ⚡ evita bloqueos de estilos
  template: `
    <div class="avionetas-form-container">
      <h2>{{ editMode ? 'Editar Avioneta' : 'Registrar Nueva Avioneta' }}</h2>

      <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>
        <div class="form-row">
          <label>Código:</label>
          <input
            name="codigo"
            [(ngModel)]="avioneta.codigo"
            required
            minlength="3"
            maxlength="20"
            placeholder="ABC123"
          />
        </div>

        <div class="form-row">
          <label>Modelo:</label>
          <input
            name="modelo"
            [(ngModel)]="avioneta.modelo"
            required
            minlength="2"
            maxlength="50"
            placeholder="Cessna 172"
          />
        </div>

        <div class="form-row">
          <label>Horas de vuelo:</label>
          <input
            type="number"
            name="horasVuelo"
            [(ngModel)]="avioneta.horasVuelo"
            min="0"
            step="0.1"
            required
          />
        </div>

        <div class="form-row">
          <label>Estado:</label>
          <select name="estado" [(ngModel)]="avioneta.estado" required>
            <option value="Activo">Activo</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>

        <div *ngIf="mensajeError" class="avionetas-error">{{ mensajeError }}</div>
        <div *ngIf="mensajeExito" class="avionetas-success">{{ mensajeExito }}</div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">
            {{ editMode ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="cancel" (click)="cancelar()">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    /* Contenedor principal */
    .avionetas-form-container {
      max-width: 550px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
      transition: all 0.3s ease-in-out;
      font-family: Arial, sans-serif;
    }

    .avionetas-form-container h2 {
      text-align: center;
      margin-bottom: 1.8rem;
      color: #343a40;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .form-row {
      margin-bottom: 1.4rem;
      display: flex;
      flex-direction: column;
    }

    .form-row label {
      font-weight: 600;
      margin-bottom: 0.4rem;
      color: #495057;
    }

    .form-row input,
    .form-row select {
      padding: 0.65rem 0.8rem;
      border-radius: 8px;
      border: 1px solid #ced4da;
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-row input:focus,
    .form-row select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }

    .form-actions button {
      padding: 0.7rem 1.6rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }

    .form-actions button[type="submit"] {
      background-color: #007bff;
      color: #fff;
    }

    .form-actions button[type="submit"]:hover:not(:disabled) {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    .form-actions .cancel {
      background-color: #6c757d;
      color: #fff;
    }

    .form-actions .cancel:hover {
      background-color: #5a6268;
      transform: translateY(-2px);
    }

    .form-actions button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .avionetas-error {
      color: #dc3545;
      font-weight: bold;
      margin-top: 0.8rem;
      text-align: center;
    }

    .avionetas-success {
      color: #28a745;
      font-weight: bold;
      margin-top: 0.8rem;
      text-align: center;
    }
  `]
})
export class AvionetasFormComponent implements OnInit {
  avioneta: Avioneta = {
    codigo: '',
    modelo: '',
    horasVuelo: 0,
    estado: 'Activo'
  };

  editMode = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private avionetasService: AvionetasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.avionetasService.obtenerPorId(+id).subscribe({
        next: (data) => this.avioneta = data,
        error: () => this.mensajeError = 'Error al cargar los datos de la avioneta.'
      });
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      this.mensajeError = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.editMode && this.avioneta.idAvioneta) {
      this.avionetasService.actualizar(this.avioneta.idAvioneta, this.avioneta).subscribe({
        next: () => {
          this.mensajeExito = 'Avioneta actualizada correctamente.';
          setTimeout(() => this.router.navigate(['/avionetas']), 1000);
        },
        error: () => this.mensajeError = 'Error al actualizar la avioneta.'
      });
    } else {
      this.avionetasService.guardar(this.avioneta).subscribe({
        next: () => {
          this.mensajeExito = 'Avioneta guardada correctamente.';
          setTimeout(() => this.router.navigate(['/avionetas']), 1000);
        },
        error: () => this.mensajeError = 'Error al guardar la avioneta.'
      });
    }
  }

  cancelar() {
    this.router.navigate(['/avionetas']);
  }
}
