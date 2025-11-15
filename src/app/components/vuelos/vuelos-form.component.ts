import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VuelosService } from '../../services/vuelos.service';
import { Vuelo } from '../../models/vuelos.model';
import { UsuariosService } from '../../services/usuarios.service';
import { AvionetasService } from '../../services/avionetas.service';
import { Usuario } from '../../models/usuario.model';
import { Avioneta } from '../../models/avioneta.model';

@Component({
  selector: 'app-vuelos-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `

    <div class="vuelos-container">
      <h2>{{ editMode ? 'Editar Vuelo' : 'Nuevo Vuelo' }}</h2>

      <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>

        <!-- =======================
            SELECT ALUMNO
        ======================== -->
        <div class="row">
          <label>Alumno:</label>

          <div class="select-search-container">
            <div class="selected" (click)="toggleDropdown('alumno')">
              {{ alumnoSeleccionadoTexto() }}
            </div>

            <div class="dropdown" *ngIf="dropdownAlumno">
              <input type="text" [(ngModel)]="filtroAlumno" name="filtroAlumno" placeholder="Buscar alumno..." />

              <div class="option"
                *ngFor="let a of alumnosFiltrados()"
                (click)="seleccionarAlumno(a)">
                {{ a.nombre }} {{ a.apellido }}
              </div>
            </div>
          </div>
        </div>


        <!-- =======================
            SELECT TUTOR
        ======================== -->
        <div class="row">
          <label>Tutor:</label>

          <div class="select-search-container">
            <div class="selected" (click)="toggleDropdown('tutor')">
              {{ tutorSeleccionadoTexto() }}
            </div>

            <div class="dropdown" *ngIf="dropdownTutor">
              <input type="text" [(ngModel)]="filtroTutor" name="filtroTutor" placeholder="Buscar tutor..." />

              <div class="option"
                *ngFor="let t of tutoresFiltrados()"
                (click)="seleccionarTutor(t)">
                {{ t.nombre }} {{ t.apellido }}
              </div>
            </div>
          </div>
        </div>

        <!-- =======================
            SELECT AVIONETA
        ======================== -->
        <div class="row">
          <label>Avioneta:</label>

          <div class="select-search-container">
            <div class="selected" (click)="toggleDropdown('avioneta')">
              {{ avionetaSeleccionadaTexto() }}
            </div>

            <div class="dropdown" *ngIf="dropdownAvioneta">
              <input type="text" [(ngModel)]="filtroAvioneta" name="filtroAvioneta" placeholder="Buscar avioneta..." />

              <div class="option"
                *ngFor="let av of avionetasFiltradas()"
                (click)="seleccionarAvioneta(av)">
                {{ av.codigo }} - {{ av.modelo }}
              </div>
            </div>
          </div>
        </div>

        <!-- DATOS DEL VUELO -->
        <div class="row">
          <label>Fecha:</label>
          <input type="date" name="fecha" [(ngModel)]="vuelo.fecha" required />
        </div>

        <div class="row">
          <label>Hora:</label>
          <input type="time" name="hora" [(ngModel)]="vuelo.hora" required />
        </div>

        <div class="row">
          <label>Estado:</label>
          <select name="estado" [(ngModel)]="vuelo.estado">
            <option value="Programado">Programado</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div class="row">
          <label>Observación:</label>
          <input type="text" name="observacion" [(ngModel)]="vuelo.observacion" placeholder="Opcional" />
        </div>

        <div class="actions">
          <button type="submit" [disabled]="form.invalid">{{ editMode ? 'Actualizar' : 'Guardar' }}</button>
          <button type="button" class="cancel" (click)="cancelar()">Cancelar</button>
        </div>

      </form>
    </div>

  `,
  styles: [`

    .select-search-container {
      position: relative;
      width: 100%;
    }

    .selected {
      padding: 0.6rem;
      border: 1px solid #ced4da;
      border-radius: 8px;
      background: white;
      cursor: pointer;
    }

    .dropdown {
      position: absolute;
      top: 105%;
      left: 0;
      width: 100%;
      background: white;
      border: 1px solid #ced4da;
      border-radius: 8px;
      max-height: 220px;
      overflow-y: auto;
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
      padding: 0.5rem;
      z-index: 999;
    }

    .dropdown input {
      width: 100%;
      padding: 0.4rem;
      margin-bottom: 0.4rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .option {
      padding: 0.4rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .option:hover {
      background: #007bff;
      color: white;
    }

    /* todo tu CSS original aquí ↓ */
    .vuelos-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    h2 {text-align: center;margin-bottom: 1.5rem;color:#343a40;font-weight:700;}
    .row {margin-bottom: 1rem;display: flex;flex-direction: column;}
    label {font-weight:600;margin-bottom:0.3rem;color:#495057;}
    input, select {padding:0.6rem;border-radius:8px;border:1px solid #ced4da;}

    .actions {display:flex;justify-content:space-between;margin-top:1.5rem;}
    button {padding:0.7rem 1.4rem;border:none;border-radius:8px;cursor:pointer;font-weight:600;}
    .cancel {background:#6c757d;color:white;}
  `]
})
export class VuelosFormComponent implements OnInit {

  vuelo: Vuelo = {
    idAlumno: 0,
    idTutor: 0,
    idAvioneta: 0,
    fecha: '',
    hora: '',
    estado: 'Programado',
    observacion: ''
  };

  editMode = false;

  alumnos: Usuario[] = [];
  tutores: Usuario[] = [];
  avionetas: Avioneta[] = [];

  // filtros
  filtroAlumno = '';
  filtroTutor = '';
  filtroAvioneta = '';

  // controlar dropdowns
  dropdownAlumno = false;
  dropdownTutor = false;
  dropdownAvioneta = false;

  constructor(
    private vuelosService: VuelosService,
    private usuariosService: UsuariosService,
    private avionetasService: AvionetasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.vuelosService.obtenerPorId(+id).subscribe(v => this.vuelo = v);
    }

    this.usuariosService.listar().subscribe(users => {
      this.alumnos = users.filter(u => u.rol === 'Alumno');
      this.tutores = users.filter(u => u.rol === 'Tutor');
    });

    this.avionetasService.listar().subscribe(a => this.avionetas = a);
  }


  // CERRAR DROPDOWNS AL CLIC FUERA
  @HostListener('document:click', ['$event'])
  clickFuera(event: any) {
    if (!event.target.closest('.select-search-container')) {
      this.dropdownAlumno = false;
      this.dropdownTutor = false;
      this.dropdownAvioneta = false;
    }
  }

  toggleDropdown(tipo: string) {
    this.dropdownAlumno = tipo === 'alumno' ? !this.dropdownAlumno : false;
    this.dropdownTutor = tipo === 'tutor' ? !this.dropdownTutor : false;
    this.dropdownAvioneta = tipo === 'avioneta' ? !this.dropdownAvioneta : false;
  }

  // ===== FILTROS =====
  alumnosFiltrados() {
    return this.alumnos.filter(a =>
      (a.nombre + ' ' + a.apellido).toLowerCase().includes(this.filtroAlumno.toLowerCase())
    );
  }

  tutoresFiltrados() {
    return this.tutores.filter(t =>
      (t.nombre + ' ' + t.apellido).toLowerCase().includes(this.filtroTutor.toLowerCase())
    );
  }

  avionetasFiltradas() {
    return this.avionetas.filter(av =>
      (av.codigo + ' ' + av.modelo).toLowerCase().includes(this.filtroAvioneta.toLowerCase())
    );
  }

  seleccionarAlumno(a: Usuario) {
    this.vuelo.idAlumno = a.id ?? 0;
    this.dropdownAlumno = false;
  }

  seleccionarTutor(t: Usuario) {
    this.vuelo.idTutor = t.id ?? 0;
    this.dropdownTutor = false;
  }

  seleccionarAvioneta(av: Avioneta) {
    this.vuelo.idAvioneta = av.idAvioneta ?? 0;
    this.dropdownAvioneta = false;
  }


  alumnoSeleccionadoTexto() {
    const a = this.alumnos.find(x => x.id === this.vuelo.idAlumno);
    return a ? a.nombre + ' ' + a.apellido : 'Seleccione un alumno';
  }

  tutorSeleccionadoTexto() {
    const t = this.tutores.find(x => x.id === this.vuelo.idTutor);
    return t ? t.nombre + ' ' + t.apellido : 'Seleccione un tutor';
  }

  avionetaSeleccionadaTexto() {
    const av = this.avionetas.find(x => x.idAvioneta === this.vuelo.idAvioneta);
    return av ? av.codigo + ' - ' + av.modelo : 'Seleccione una avioneta';
  }


  guardar(form: NgForm) {
    if (form.invalid) return;

    if (this.editMode && this.vuelo.idVuelo) {
      this.vuelosService.actualizar(this.vuelo.idVuelo, this.vuelo).subscribe(() => {
        this.router.navigate(['/vuelos']);
      });
    } else {
      this.vuelosService.guardar(this.vuelo).subscribe(() => {
        this.router.navigate(['/vuelos']);
      });
    }
  }

  cancelar() {
    this.router.navigate(['/vuelos']);
  }
}
