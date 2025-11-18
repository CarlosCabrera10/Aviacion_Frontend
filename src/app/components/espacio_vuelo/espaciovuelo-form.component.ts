import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EspacioVueloService } from '../../services/espacioVuelo.service';
import { EspacioVuelo } from '../../models/espacioVuelo.model';

@Component({
  selector: 'app-espacios-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="espacios-container">
  <h2>{{ editMode ? 'Editar Espacio de Vuelo' : 'Nuevo Espacio de Vuelo' }}</h2>

  <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>
    <div class="row">
      <label>Nombre:</label>
      <input type="text" name="nombre" [(ngModel)]="espacio.nombre" required />
    </div>

    <div class="row">
      <label>Tipo:</label>
      <input type="text" name="tipo" [(ngModel)]="espacio.tipo" required />
    </div>

    <div class="row">
      <label>Ubicación:</label>
      <input type="text" name="ubicacion" [(ngModel)]="espacio.ubicacion" />
    </div>

    <div class="row">
      <label>Descripción:</label>
      <input type="text" name="descripcion" [(ngModel)]="espacio.descripcion" />
    </div>

    <div class="row" *ngIf="editMode">
      <label>Habilitado:</label>
      <select name="habilitado" [(ngModel)]="espacio.habilitado">
        <option [value]="true">Sí</option>
        <option [value]="false">No</option>
      </select>
    </div>

    <div class="actions">
      <button type="submit" [disabled]="form.invalid">
        {{ editMode ? 'Actualizar' : 'Guardar' }}
      </button>
      <button type="button" class="cancel" (click)="cancelar()">Cancelar</button>
    </div>
  </form>
</div>
  `,
  styles: [`
.espacios-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}
h2 { text-align: center; margin-bottom: 2rem; color: #004e92; }
.row { display: flex; flex-direction: column; margin-bottom: 1.2rem; }
.row label { font-weight: 600; margin-bottom: 0.3rem; }
.row input, .row select { width: 100%; height: 40px; padding: 0 10px; border-radius: 6px; border: 1px solid #ced4da; font-size: 14px; }
.actions { display: flex; justify-content: space-between; }
.actions button { padding: 0.6rem 1.5rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
.actions button[type="submit"] { background: #004e92; color: #fff; }
.actions .cancel { background: #6c757d; color: #fff; }
  `]
})
export class EspaciosVueloFormComponent implements OnInit {

  espacio: EspacioVuelo = {
    idEspacioVuelo: 0,
    nombre: '',
    tipo: '',
    ubicacion: '',
    descripcion: '',
    habilitado: true
  };

  editMode = false;

  constructor(
    private espaciosService: EspacioVueloService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarEspacio(+id);
  }

  private cargarEspacio(id: number) {
    this.editMode = true;
    this.espaciosService.obtenerPorId(id).subscribe({
      next: esp => this.espacio = esp,
      error: err => this.mostrarError(err, 'Error cargando espacio')
    });
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      alert('Complete todos los campos correctamente');
      return;
    }

    const obs = this.editMode
      ? this.espaciosService.actualizar(this.espacio.idEspacioVuelo!, this.espacio)
      : this.espaciosService.actualizar(this.espacio.idEspacioVuelo!, this.espacio); // Para crear se puede agregar método POST si quieres

    obs.subscribe({
      next: () => {
        alert(this.editMode ? 'Espacio actualizado correctamente' : 'Espacio guardado correctamente');
        this.router.navigate(['/admin/espacios']);
      },
      error: err => this.mostrarError(err, this.editMode ? 'Error actualizando espacio' : 'Error guardando espacio')
    });
  }

  cancelar() {
    this.router.navigate(['/admin/espacios']);
  }

  private mostrarError(err: any, mensajeDefault: string) {
    const msg = err.error?.mensaje || err.error?.message || mensajeDefault;
    alert(msg);
  }
}
