import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

import { Router } from '@angular/router';
import { AlumnoService } from '../../../services/alumno.service';

@Component({
  selector: 'app-horario-alumno',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './horario-alumno.html',
  styleUrls: ['./horario-alumno.css'],
  encapsulation: ViewEncapsulation.None
})
export class HorarioAlumnoComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',

    locale: esLocale,

    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },

    events: [],

    eventClick: (info) => this.onEventClick(info),
  };

  stats = {
    programados: 0,
    completados: 0,
    cancelados: 0,
    total: 0
  };

  constructor(
    private router: Router,
    private alumnoService: AlumnoService
  ) {}

  ngOnInit(): void {
    this.cargarMisVuelos();
  }

  cargarMisVuelos() {
    const idAlumno = Number(localStorage.getItem('id_usuario'));

    this.alumnoService.obtenerVuelos(idAlumno).subscribe((vuelos) => {

      // KPIs
      this.stats.programados = vuelos.filter(v => v.estado === 'Programado').length;
      this.stats.completados = vuelos.filter(v => v.estado === 'Completado').length;
      this.stats.cancelados = vuelos.filter(v => v.estado === 'Cancelado').length;
      this.stats.total = vuelos.length;

      // Mapear eventos del calendario
      this.calendarOptions.events = vuelos.map(v => ({
        id: String(v.idVuelo),
        title: `${v.nombreTutor} (${v.codigoAvioneta})`,
        start: `${v.fecha}T${v.horaInicio}`,
        end: v.horaFin ? `${v.fecha}T${v.horaFin}` : undefined,
        color:
          v.estado === 'Completado'
            ? '#198754'
            : v.estado === 'Cancelado'
            ? '#dc3545'
            : '#0d6efd',
      }));
    });
  }

  onEventClick(info: EventClickArg) {
    const idVuelo = info.event.id;
    this.router.navigate(['/alumno/vuelo/detalle', idVuelo]);
  }

}
