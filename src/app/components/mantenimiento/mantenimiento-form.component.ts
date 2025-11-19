import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { AvionetasService } from '../../services/avionetas.service';
import { Mantenimiento } from '../../models/mantenimiento.model';
import { Avioneta } from '../../models/avioneta.model';

@Component({
  selector: 'app-mantenimiento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="card">
  <h2 class="title">{{ editMode ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento' }}</h2>

  <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>

    <!-- AVIONETA -->
    <div class="form-group">
      <label>Avioneta</label>

      <div class="input-wrapper">
        <input 
          type="text"
          placeholder="Buscar avioneta..."
          [(ngModel)]="filtroAvioneta"
          name="filtroAvioneta"
          (focus)="showDropdown=true"
          (blur)="cerrarDropdown()"
          autocomplete="off"
        />

        <ul *ngIf="showDropdown && avionetasFiltradas().length" class="dropdown">
          <li *ngFor="let a of avionetasFiltradas()" (mousedown)="seleccionarAvioneta(a)">
            ✈️ {{ a.codigo }}
          </li>
        </ul>
      </div>
    </div>

    <!-- DESCRIPCIÓN -->
    <div class="form-group">
      <label>Descripción</label>
      <textarea name="descripcion" [(ngModel)]="mantenimiento.descripcion" required></textarea>
    </div>

    <!-- TIPO -->
    <div class="form-group">
      <label>Tipo</label>
      <input type="text" name="tipo" [(ngModel)]="mantenimiento.tipo" required />
    </div>

    <!-- ESTADO -->
    <div *ngIf="editMode" class="form-group">
      <label>Estado</label>
      <select name="estado" [(ngModel)]="mantenimiento.estado" required>
        <option *ngFor="let e of estados" [value]="e">{{ e }}</option>
      </select>
    </div>

    <!-- NOTAS -->
    <div class="form-group">
      <label>Notas</label>
      <textarea name="notas" [(ngModel)]="mantenimiento.notas"></textarea>
    </div>

    <!-- FECHAS -->
    <div class="form-row">
      <div class="form-group">
        <label>Fecha Inicio</label>
        <input type="datetime-local" name="fechaInicio" [(ngModel)]="mantenimiento.fechaInicio" readonly />
      </div>

      <div class="form-group">
        <label>Fecha Fin</label>
        <input type="datetime-local" name="fechaFin" [(ngModel)]="mantenimiento.fechaFin" readonly />
      </div>
    </div>

    <!-- MENSAJES -->
    <div *ngIf="mensajeError" class="alert error">{{ mensajeError }}</div>
    <div *ngIf="mensajeExito" class="alert success">{{ mensajeExito }}</div>

    <!-- BOTONES -->
    <div class="button-row">
      <button type="submit" class="btn primary" [disabled]="form.invalid">
        {{ editMode ? 'Actualizar' : 'Guardar' }}
      </button>

      <button type="button" class="btn secondary" (click)="cancelar()">
        Cancelar
      </button>
    </div>

  </form>
</div>
  `,
  styles: [`
.card {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.1);
  font-family: 'Inter', Arial, sans-serif;
}

.title {
  text-align: center;
  color: #004e92;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.4rem;
  color: #2c3e50;
}

input, select, textarea {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #d0d7de;
  background: #fdfdfd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

input:focus, select:focus, textarea:focus {
  border-color: #004e92;
  box-shadow: 0 0 4px rgba(0, 78, 146, 0.3);
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 70px;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.input-wrapper {
  position: relative;
}

.dropdown {
  position: absolute;
  width: 100%;
  background: white;
  margin-top: 4px;
  border-radius: 8px;
  border: 1px solid #ccc;
  max-height: 180px;
  overflow-y: auto;
  padding: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dropdown li {
  list-style: none;
  padding: 0.7rem;
  cursor: pointer;
  transition: 0.2s;
}

.dropdown li:hover {
  background: #004e92;
  color: white;
}

.alert {
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 0.8rem;
  font-weight: 600;
}

.alert.error {
  background: #f8d7da;
  color: #a94442;
}

.alert.success {
  background: #d4edda;
  color: #2e7d32;
}

.button-row {
  display: flex;
  justify-content: space-between;
  margin-top: 1.4rem;
}

.btn {
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
  font-size: 1rem;
}

.btn.primary {
  background: linear-gradient(90deg, #004e92, #0073c4);
  color: white;
  border: none;
}

.btn.primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn.secondary {
  background: #e0e0e0;
  color: #333;
  border: none;
}

.btn.secondary:hover {
  background: #cacaca;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
  `]
})
export class MantenimientoFormComponent implements OnInit {

  mantenimiento: Mantenimiento = {
    descripcion: '',
    tipo: '',
    estado: 'En_proceso',
    fechaInicio: this.formatFechaLocal(new Date()),
    fechaFin: undefined
  };

  avionetas: Avioneta[] = [];
  estados = ['En_proceso', 'Finalizado', 'Pausado'];
  editMode = false;
  id?: number;
  mensajeError = '';
  mensajeExito = '';

  filtroAvioneta: string = '';
  showDropdown = false;

  constructor(
    private mantenimientoService: MantenimientoService,
    private avionetaService: AvionetasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarAvionetas();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.editMode = true;
      this.mantenimientoService.obtenerPorId(this.id).subscribe({
        next: (m) => {
          m.fechaInicio = this.formatFechaLocal(m.fechaInicio);
          m.fechaFin = this.formatFechaLocal(m.fechaFin);
          this.mantenimiento = m;
          if (m.avioneta) this.filtroAvioneta = m.avioneta.codigo;
        },
        error: (err) => this.mensajeError = 'Error al cargar mantenimiento: ' + err.message
      });
    }
  }

  listarAvionetas() {
    this.avionetaService.listar().subscribe({
      next: (a) => this.avionetas = a,
      error: () => this.mensajeError = 'Error al cargar avionetas.'
    });
  }

  avionetasFiltradas(): Avioneta[] {
    if (!this.filtroAvioneta) return this.avionetas;
    return this.avionetas.filter(a =>
      a.codigo.toLowerCase().includes(this.filtroAvioneta.toLowerCase())
    );
  }

  seleccionarAvioneta(a: Avioneta) {
    this.mantenimiento.avioneta = a;
    this.filtroAvioneta = a.codigo;
    this.showDropdown = false;
  }

  cerrarDropdown() {
    setTimeout(() => this.showDropdown = false, 150);
  }

  guardar(form: NgForm) {
    if (form.invalid || !this.mantenimiento.avioneta) {
      this.mensajeError = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    const now = new Date();

    if (!this.editMode) {
      this.mantenimiento.estado = 'En_proceso';
      this.mantenimiento.fechaInicio = this.formatFechaLocal(now);
      this.mantenimiento.fechaFin = undefined;
    } else {
      if (this.mantenimiento.estado === 'En_proceso') {
        this.mantenimiento.fechaInicio = this.formatFechaLocal(now);
        this.mantenimiento.fechaFin = undefined;
      }
      if (this.mantenimiento.estado === 'Finalizado') {
        this.mantenimiento.fechaFin = this.formatFechaLocal(now);
      }
    }

    if (this.editMode && this.id !== undefined) {
      this.mantenimientoService.actualizar(this.id, this.mantenimiento).subscribe({
        next: () => {
          this.mensajeExito = 'Mantenimiento actualizado correctamente.';
          setTimeout(() => this.router.navigate(['/admin/mantenimientos']), 800);
        },
        error: (err) => this.mensajeError = 'Error al actualizar mantenimiento: ' + err.message
      });
    } else {
      this.mantenimientoService.guardar(this.mantenimiento).subscribe({
        next: () => {
          this.mensajeExito = 'Mantenimiento guardado correctamente.';
          setTimeout(() => this.router.navigate(['/admin/mantenimientos']), 800);
        },
        error: (err) => this.mensajeError = 'Error al guardar mantenimiento: ' + err.message
      });
    }
  }

  cancelar() {
    this.router.navigate(['/admin/mantenimientos']);
  }

  private formatFechaLocal(fecha: Date | string | undefined): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  }
}
