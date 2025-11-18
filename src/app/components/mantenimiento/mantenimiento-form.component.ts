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
<div class="container">
  <h2>{{ editMode ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento' }}</h2>

  <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>

    <label>Avioneta:</label>
    <input type="text" placeholder="Buscar..." [(ngModel)]="filtroAvioneta" name="filtroAvioneta"
           (focus)="showDropdown=true" (blur)="cerrarDropdown()" autocomplete="off" />
    
    <ul *ngIf="showDropdown && avionetasFiltradas().length" class="dropdown">
      <li *ngFor="let a of avionetasFiltradas()" (mousedown)="seleccionarAvioneta(a)">
        {{ a.codigo }}
      </li>
    </ul>

    <label>Descripción:</label>
    <textarea name="descripcion" [(ngModel)]="mantenimiento.descripcion" required></textarea>

    <label>Tipo:</label>
    <input type="text" name="tipo" [(ngModel)]="mantenimiento.tipo" required />

    <div *ngIf="editMode">
      <label>Estado:</label>
      <select name="estado" [(ngModel)]="mantenimiento.estado" required>
        <option *ngFor="let e of estados" [value]="e">{{ e }}</option>
      </select>
    </div>

    <label>Notas:</label>
    <textarea name="notas" [(ngModel)]="mantenimiento.notas"></textarea>

    <label>Fecha Inicio:</label>
    <input type="datetime-local" name="fechaInicio" [(ngModel)]="mantenimiento.fechaInicio" readonly />

    <label>Fecha Fin:</label>
    <input type="datetime-local" name="fechaFin" [(ngModel)]="mantenimiento.fechaFin" readonly />

    <div *ngIf="mensajeError" class="error">{{ mensajeError }}</div>
    <div *ngIf="mensajeExito" class="success">{{ mensajeExito }}</div>

    <div class="buttons">
      <button type="submit" [disabled]="form.invalid">{{ editMode ? 'Actualizar' : 'Guardar' }}</button>
      <button type="button" (click)="cancelar()">Cancelar</button>
    </div>

  </form>
</div>
  `,
  styles: [`
.container {
  max-width: 600px; margin: 2rem auto; padding: 2rem;
  background: #fff; border-radius: 12px; font-family: Arial, sans-serif;
  position: relative;
}
h2 { text-align: center; margin-bottom: 1rem; color: #004e92; }
label { display: block; margin-top: 1rem; font-weight: bold; }
input, select, textarea { width: 100%; padding: 0.5rem; margin-top: 0.3rem; border: 1px solid #ccc; border-radius: 6px; }
textarea { resize: vertical; }
.buttons { margin-top: 1.5rem; display: flex; justify-content: space-between; }
button { padding: 0.5rem 1rem; border: none; border-radius: 6px; background-color: #004e92; color: #fff; cursor: pointer; }
button:hover { background-color: #003366; }
button:disabled { cursor: not-allowed; opacity: 0.6; }
.error { color: #d9534f; margin-bottom: 1rem; font-weight: bold; }
.success { color: #28a745; margin-bottom: 1rem; font-weight: bold; }

.dropdown {
  position: absolute;
  background: #fff;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 0.2rem;
  z-index: 1000;
  list-style: none;
  padding: 0;
}
.dropdown li {
  padding: 0.5rem;
  cursor: pointer;
}
.dropdown li:hover {
  background: #004e92;
  color: #fff;
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
    setTimeout(() => this.showDropdown = false, 150); // permite click en la lista antes de cerrar
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
