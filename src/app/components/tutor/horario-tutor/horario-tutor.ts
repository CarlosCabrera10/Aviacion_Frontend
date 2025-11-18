import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

import { Router } from '@angular/router';
import { VuelosService } from '../../../services/vuelos.service';

@Component({
  selector: 'app-horario-tutor',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './horario-tutor.html',
  styleUrls: ['./horario-tutor.css'],
  encapsulation: ViewEncapsulation.None 
})
export class TutorHorarioComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',

    locale: esLocale, // 🔥 Traducimos todo a español


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

  constructor(private router: Router, private vuelosService: VuelosService) {}

  ngOnInit(): void {
    this.cargarVuelos();
  }

stats = {
  programados: 0,
  completados: 0,
  cancelados: 0,
  total: 0
};

  
cargarVuelos() {
  const idTutor = Number(localStorage.getItem('id_usuario'));

  this.vuelosService.listarPorTutor(idTutor).subscribe((vuelos) => {

    // CONTADORES
    this.stats.programados = vuelos.filter(v => v.estado === 'Programado').length;
    this.stats.completados = vuelos.filter(v => v.estado === 'Completado').length;
    this.stats.cancelados = vuelos.filter(v => v.estado === 'Cancelado').length;
    this.stats.total = vuelos.length;

    // MAPEAMOS EVENTOS FULLCALENDAR
    this.calendarOptions.events = vuelos.map(v => ({
      id: String(v.idVuelo),
      title: `${v.nombreAlumno} (${v.codigoAvioneta})`,
      start: `${v.fecha}T${v.horaInicio}`,   // ← FIX
      end: v.horaFin ? `${v.fecha}T${v.horaFin}` : undefined, // opcional
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
  this.router.navigate(['/tutor/vuelos/editar', idVuelo]);
}

}
