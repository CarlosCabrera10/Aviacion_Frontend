import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VuelosService } from '../../services/vuelos.service';
import { Vuelo } from '../../models/vuelos.model';
import { UsuariosService } from '../../services/usuarios.service';
import { AvionetasService } from '../../services/avionetas.service';
import { EspacioVueloService } from '../../services/espacioVuelo.service';
import { Usuario } from '../../models/usuario.model';
import { Avioneta } from '../../models/avioneta.model';
import { EspacioVuelo } from '../../models/espacioVuelo.model';

@Component({
  selector: 'app-vuelos-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
<div class="vuelos-container">
  <h2>{{ editMode ? 'Editar Vuelo' : 'Nuevo Vuelo' }}</h2>

  <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>

    <!-- Alumno -->
    <div class="row">
      <label>Alumno:</label>
      <div class="dropdown-container">
        <input type="text" placeholder="Buscar alumno..."
               [(ngModel)]="filtroAlumno"
               (focus)="showDropdownAlumno=true"
               (input)="filtrarAlumnos()"
               name="filtroAlumno" required />
        <ul *ngIf="showDropdownAlumno" class="dropdown-list">
          <li *ngFor="let a of alumnosFiltrados" (click)="seleccionarAlumno(a)">
            {{ a.nombre }} {{ a.apellido }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Tutor -->
    <div class="row">
      <label>Tutor:</label>
      <div class="dropdown-container">
        <input type="text" placeholder="Buscar tutor..."
               [(ngModel)]="filtroTutor"
               (focus)="showDropdownTutor=true"
               (input)="filtrarTutores()"
               name="filtroTutor" required />
        <ul *ngIf="showDropdownTutor" class="dropdown-list">
          <li *ngFor="let t of tutoresFiltrados" (click)="seleccionarTutor(t)">
            {{ t.nombre }} {{ t.apellido }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Avioneta -->
    <div class="row">
      <label>Avioneta:</label>
      <div class="dropdown-container">
        <input type="text" placeholder="Buscar avioneta..."
               [(ngModel)]="filtroAvioneta"
               (focus)="showDropdownAvioneta=true"
               (input)="filtrarAvionetas()"
               name="filtroAvioneta" required />
        <ul *ngIf="showDropdownAvioneta" class="dropdown-list">
          <li *ngFor="let av of avionetasFiltradas"
              (click)="seleccionarAvioneta(av)"
              [class.disabled]="av.estado?.toUpperCase() === 'MANTENIMIENTO'">
            {{ av.codigo }} - {{ av.modelo }}
            <span class="estado" [ngClass]="av.estado?.toLowerCase()">
              {{ av.estado }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Fecha -->
    <div class="row">
      <label>Fecha:</label>
      <input type="date" name="fecha" [(ngModel)]="vuelo.fecha"
             [min]="minDate" required />
    </div>

    <!-- Horario -->
    <div class="row select-container">
      <label>Horario:</label>
      <select name="horaBloque" [(ngModel)]="vuelo.horaBloque"
              (change)="asignarHoras()" required>
        <option value="" disabled>Seleccione un horario</option>
        <option *ngFor="let b of bloques" [value]="b.texto">
          {{ b.texto }}
        </option>
      </select>
    </div>

    <!-- Espacio -->
    <div class="row select-container">
      <label>Espacio de vuelo:</label>
      <select name="idEspacioVuelo" [(ngModel)]="vuelo.idEspacioVuelo" required>
        <option value="" disabled>Seleccione un espacio</option>
        <option *ngFor="let e of espacios" 
                [value]="e.idEspacioVuelo"
                [disabled]="!e.habilitado">
          {{ e.nombre }} <span *ngIf="!e.habilitado">(Deshabilitado)</span>
        </option>
      </select>
    </div>

    <!-- Estado -->
    <div class="row" *ngIf="editMode">
      <label>Estado:</label>
      <select name="estado" [(ngModel)]="vuelo.estado">
        <option value="Programado">Programado</option>
        <option value="Completado">Completado</option>
        <option value="Cancelado">Cancelado</option>
      </select>
    </div>

    <!-- Observación -->
    <div class="row">
      <label>Observación:</label>
      <input type="text" name="observacion" [(ngModel)]="vuelo.observacion" />
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
.vuelos-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}
h2 { text-align: center; margin-bottom: 2rem; color: #004e92; }
.row { display: flex; flex-direction: column; margin-bottom: 1.4rem; }
.row label { font-weight: 600; margin-bottom: 0.4rem; }
.row input, .row select { width: 100%; height: 44px; padding: 0 12px; border-radius: 8px; border: 1px solid #ced4da; font-size: 14px; box-sizing: border-box; }
.dropdown-container { position: relative; }
.dropdown-list { position: absolute; top: 46px; width: 100%; background: #fff; border: 1px solid #ccc; border-radius: 8px; max-height: 200px; overflow-y: auto; z-index: 999; }
.dropdown-list li { padding: 10px; cursor: pointer; display: flex; justify-content: space-between; }
.estado.disponible { color: green; }
.estado.mantenimiento { color: red; font-weight: 600; }
.dropdown-list li.disabled { background: #ffe6e6; color: #b30000; cursor: not-allowed; }
.dropdown-list li.disabled:hover { background: #ffe6e6; }
.dropdown-list li:hover:not(.disabled) { background: #eee; }
.actions { display: flex; justify-content: space-between; }
.actions button { padding: 0.7rem 1.6rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
.actions button[type="submit"] { background: #004e92; color: white; }
.actions .cancel { background: #6c757d; color: #fff; }
option:disabled { color: #b30000; background: #ffe6e6; }
  `]
})
export class VuelosFormComponent implements OnInit {

  vuelo: Vuelo = {
    idAlumno: 0,
    idTutor: 0,
    idAvioneta: 0,
    idEspacioVuelo: 0,
    fecha: '',
    estado: 'Programado',
    hora: 0
  };

  minDate = "";
  bloques = [
    { texto: '8:00 a 10:00', inicio: '08:00', fin: '10:00' },
    { texto: '10:00 a 12:00', inicio: '10:00', fin: '12:00' },
    { texto: '13:00 a 15:00', inicio: '13:00', fin: '15:00' },
    { texto: '15:00 a 17:00', inicio: '15:00', fin: '17:00' }
  ];

  alumnos: Usuario[] = [];
  alumnosFiltrados: Usuario[] = [];
  filtroAlumno = "";
  showDropdownAlumno = false;

  tutores: Usuario[] = [];
  tutoresFiltrados: Usuario[] = [];
  filtroTutor = "";
  showDropdownTutor = false;

  avionetas: Avioneta[] = [];
  avionetasFiltradas: Avioneta[] = [];
  filtroAvioneta = "";
  showDropdownAvioneta = false;

  espacios: EspacioVuelo[] = [];
  editMode = false;

  constructor(
    private vuelosService: VuelosService,
    private usuariosService: UsuariosService,
    private avionetasService: AvionetasService,
    private espaciosService: EspacioVueloService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.minDate = new Date().toISOString().split("T")[0];
    const id = this.route.snapshot.paramMap.get('id');

    this.cargarDropdowns().then(() => {
      if (id) this.cargarVuelo(+id);
      else this.vuelo.horaBloque = this.bloques[0].texto;
      this.asignarHoras();
    });
  }

  private async cargarDropdowns() {
    try {
      const users = await this.usuariosService.listar().toPromise() || [];
      this.alumnos = users.filter(u => u.rol === 'Alumno');
      this.tutores = users.filter(u => u.rol === 'Tutor');
      this.alumnosFiltrados = [...this.alumnos];
      this.tutoresFiltrados = [...this.tutores];

      const avs = await this.avionetasService.listar().toPromise() || [];
      this.avionetas = avs;
      this.avionetasFiltradas = [...avs];

      const esp = await this.espaciosService.listar().toPromise() || [];
      this.espacios = esp;
      if (!this.vuelo.idEspacioVuelo && esp.length > 0)
        this.vuelo.idEspacioVuelo = esp[0].habilitado ? esp[0].idEspacioVuelo : 0;

    } catch (err: any) {
      this.mostrarError(err, "Error cargando datos");
    }
  }

  private cargarVuelo(id: number) {
    this.editMode = true;
    this.vuelosService.obtenerPorId(id).subscribe({
      next: v => {
        this.vuelo = v;
        this.vuelo.fecha = v.fecha.split('T')[0];
        if (!this.vuelo.horaBloque) this.vuelo.horaBloque = this.bloques[0].texto;
        this.asignarHoras();

        const alumno = this.alumnos.find(a => a.id === this.vuelo.idAlumno);
        if (alumno) this.filtroAlumno = `${alumno.nombre} ${alumno.apellido}`;
        const tutor = this.tutores.find(t => t.id === this.vuelo.idTutor);
        if (tutor) this.filtroTutor = `${tutor.nombre} ${tutor.apellido}`;
        const av = this.avionetas.find(x => x.idAvioneta === this.vuelo.idAvioneta);
        if (av) this.filtroAvioneta = `${av.codigo} - ${av.modelo}`;
      },
      error: err => this.mostrarError(err, "Error cargando vuelo")
    });
  }

  asignarHoras() {
    const b = this.bloques.find(x => x.texto === this.vuelo.horaBloque);
    if (b) {
      this.vuelo.horaInicio = b.inicio;
      this.vuelo.horaFin = b.fin;
    }
  }

  seleccionarAlumno(a: Usuario) {
    this.vuelo.idAlumno = a.id!;
    this.filtroAlumno = `${a.nombre} ${a.apellido}`;
    this.showDropdownAlumno = false;
  }

  filtrarAlumnos() {
    this.alumnosFiltrados = this.alumnos.filter(a =>
      `${a.nombre} ${a.apellido}`.toLowerCase().includes(this.filtroAlumno.toLowerCase())
    );
  }

  filtrarAvionetas() {
  this.avionetasFiltradas = this.avionetas.filter(av =>
    `${av.codigo} ${av.modelo}`.toLowerCase().includes(this.filtroAvioneta.toLowerCase())
    );
  }


  seleccionarTutor(t: Usuario) {
    this.vuelo.idTutor = t.id!;
    this.filtroTutor = `${t.nombre} ${t.apellido}`;
    this.showDropdownTutor = false;
  }

  filtrarTutores() {
    this.tutoresFiltrados = this.tutores.filter(t =>
      `${t.nombre} ${t.apellido}`.toLowerCase().includes(this.filtroTutor.toLowerCase())
    );
  }

  seleccionarAvioneta(av: Avioneta) {
    if (av.estado?.toUpperCase() === "MANTENIMIENTO") {
      alert(`La avioneta ${av.codigo} está en mantenimiento y no puede usarse.`);
      return;
    }
    this.vuelo.idAvioneta = av.idAvioneta!;
    this.filtroAvioneta = `${av.codigo} - ${av.modelo}`;
    this.showDropdownAvioneta = false;
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      alert("Complete todos los campos correctamente");
      return;
    }

    if (!this.editMode) this.vuelo.estado = "Programado";

    const obs = this.editMode
      ? this.vuelosService.actualizar(this.vuelo.idVuelo!, this.vuelo)
      : this.vuelosService.guardar(this.vuelo);

    obs.subscribe({
      next: () => {
        alert(this.editMode ? "Vuelo actualizado correctamente" : "Vuelo guardado correctamente");
        this.router.navigate(['/admin/vuelos']);
      },
      error: err => this.mostrarError(err, this.editMode ? "Error actualizando vuelo" : "Error guardando vuelo")
    });
  }

  cancelar() {
    this.router.navigate(['/admin/vuelos']);
  }

  private mostrarError(err: any, mensajeDefault: string) {
    const msg = err.error?.mensaje || err.error?.message || mensajeDefault;
    alert(msg);
  }
}
