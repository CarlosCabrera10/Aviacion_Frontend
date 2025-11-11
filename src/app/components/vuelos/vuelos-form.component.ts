import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None, // permite aplicar estilos
  template: `
    <div class="vuelos-container">
      <h2>{{ editMode ? 'Editar Vuelo' : 'Nuevo Vuelo' }}</h2>
      <form #form="ngForm" (ngSubmit)="guardar(form)" novalidate>
        
        <div class="row">
          <label>Alumno:</label>
          <select name="idAlumno" [(ngModel)]="vuelo.idAlumno" required>
            <option value="" disabled>Seleccione un alumno</option>
            <option *ngFor="let a of alumnos" [value]="a.id">{{ a.nombre }} {{ a.apellido }}</option>
          </select>
        </div>

        <div class="row">
          <label>Tutor:</label>
          <select name="idTutor" [(ngModel)]="vuelo.idTutor" required>
            <option value="" disabled>Seleccione un tutor</option>
            <option *ngFor="let t of tutores" [value]="t.id">{{ t.nombre }} {{ t.apellido }}</option>
          </select>
        </div>

        <div class="row">
          <label>Avioneta:</label>
          <select name="idAvioneta" [(ngModel)]="vuelo.idAvioneta" required>
            <option value="" disabled>Seleccione una avioneta</option>
            <option *ngFor="let av of avionetas" [value]="av.idAvioneta">{{ av.codigo }} - {{ av.modelo }}</option>
          </select>
        </div>

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
    .vuelos-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #343a40;
      font-weight: 700;
    }

    .row {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 0.3rem;
      color: #495057;
    }

    input, select {
      padding: 0.6rem;
      border-radius: 8px;
      border: 1px solid #ced4da;
      font-size: 14px;
      transition: border 0.2s, box-shadow 0.2s;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
    }

    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.7rem 1.4rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s, transform 0.2s;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    button[type="submit"] {
      background-color: #007bff;
      color: #fff;
    }

    button[type="submit"]:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .cancel {
      background-color: #6c757d;
      color: #fff;
    }

    .cancel:hover {
      background-color: #5a6268;
    }
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
      this.vuelosService.obtenerPorId(+id).subscribe(data => this.vuelo = data);
    }

    this.usuariosService.listar().subscribe(users => {
      this.alumnos = users.filter(u => u.rol === 'Alumno');
      this.tutores = users.filter(u => u.rol === 'Tutor');
    });

    this.avionetasService.listar().subscribe(avs => this.avionetas = avs);
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
