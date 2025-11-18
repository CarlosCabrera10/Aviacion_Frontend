import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TutorService } from '../../../services/tutor.service';
import { Usuario } from '../../../models/usuario.model';
import { Vuelo } from '../../../models/vuelos.model';

import { BaseChartDirective, provideCharts } from 'ng2-charts';
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
  ChartData,
  ChartOptions,
} from 'chart.js';

// REGISTRO PARA TODAS LAS GRÁFICAS
Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController
);

@Component({
  selector: 'app-detalle-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, RouterModule],
  providers: [provideCharts()],
  templateUrl: './detalle-alumno.html',
  styleUrls: ['./detalle-alumno.css'],
})
export class DetalleAlumnoComponent implements OnInit {

  idAlumno!: number;

  alumno: Usuario | null = null;

  vuelosTotales: Vuelo[] = [];   // TODOS los vuelos (para KPIs y gráficas)
  vuelosFiltrados: Vuelo[] = []; // Solo tabla
  vuelosPagina: Vuelo[] = [];

  // FILTROS
  filtroEstado: string = '';
  filtroFecha: string = '';

  // PAGINACIÓN
  paginaActual = 0;
  size = 10;
  totalPaginas = 1;

  // KPIs
  totalVuelos = 0;
  completados = 0;
  cancelados = 0;
  programados = 0;

  // DONA
  doughnutData!: ChartData<'doughnut'>;
  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true },
      },
    },
  };

  // RADAR
  radarData!: ChartData<'radar'>;
  radarOptions!: ChartOptions<'radar'>;

  // BARRAS (Avionetas usadas)
  barData!: ChartData<'bar'>;
  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  // LÍNEAS (Vuelos por fecha)
  lineData!: ChartData<'line'>;
  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    }
  };

  constructor(
    private route: ActivatedRoute,
    private tutorService: TutorService
  ) {}

  ngOnInit(): void {
    this.idAlumno = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos() {
    // ALUMNO
    this.tutorService.obtenerDetalleAlumno(this.idAlumno).subscribe(a => {
      this.alumno = a;
    });

    // HISTORIAL DE VUELOS
    this.tutorService.obtenerVuelosAlumno(this.idAlumno).subscribe(v => {
      this.vuelosTotales = [...v];

      // ORDEN DESC
      this.vuelosTotales.sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      // TABLA → solo 5 al inicio
      this.vuelosFiltrados = this.vuelosTotales.slice(0, 5);

      // KPIs globales
      this.actualizarKPIsGlobales();
      this.generarDonaGlobal();

      // NUEVAS GRÁFICAS
      this.generarGraficaAvionetas();
      this.generarGraficaLineas();

      this.paginar();
    });

    // RADAR (backend)
    this.tutorService.obtenerEstadisticas(this.idAlumno).subscribe(stats => {
      this.generarRadar(stats);
    });
  }

  // ================== FILTROS ==================
  buscarPorFecha() {
    if (!this.filtroFecha) {
      this.mostrarUltimos5();
      return;
    }
    this.vuelosFiltrados = this.vuelosTotales.filter(v => v.fecha === this.filtroFecha);
    this.paginar();
  }

  filtrar() {
    this.vuelosFiltrados = this.vuelosTotales.filter(v => {
      const estadoOK = !this.filtroEstado || v.estado === this.filtroEstado;
      const fechaOK = !this.filtroFecha || v.fecha === this.filtroFecha;
      return estadoOK && fechaOK;
    });
    this.paginar();
  }

  mostrarUltimos5() {
    this.filtroFecha = '';
    this.filtroEstado = '';
    this.vuelosFiltrados = this.vuelosTotales.slice(0, 5);
    this.paginar();
  }

  limpiarFiltros() {
    this.filtroEstado = '';
    this.filtroFecha = '';
    this.vuelosFiltrados = [...this.vuelosTotales];
    this.paginar();
  }

  // ================== KPIs ==================
  actualizarKPIsGlobales() {
    this.totalVuelos = this.vuelosTotales.length;
    this.completados = this.vuelosTotales.filter(v => v.estado === 'Completado').length;
    this.cancelados = this.vuelosTotales.filter(v => v.estado === 'Cancelado').length;
    this.programados = this.vuelosTotales.filter(v => v.estado === 'Programado').length;
  }

  generarDonaGlobal() {
    this.doughnutData = {
      labels: ['Completados', 'Programados', 'Cancelados'],
      datasets: [
        {
          data: [this.completados, this.programados, this.cancelados],
          backgroundColor: ['#32cd32', '#ffb400', '#ff4b4b'],
        },
      ],
    };
  }

  // ================== NUEVAS GRÁFICAS ==================
  generarGraficaAvionetas() {
    const conteo: { [codigo: string]: number } = {};

    this.vuelosTotales.forEach(v => {
      const avion = v.codigoAvioneta ?? 'Sin código';
      conteo[avion] = (conteo[avion] || 0) + 1;

    });

    this.barData = {
      labels: Object.keys(conteo),
      datasets: [
        {
          data: Object.values(conteo),
          backgroundColor: '#003060',
        }
      ]
    };
  }

  generarGraficaLineas() {
    const conteo: { [fecha: string]: number } = {};

    this.vuelosTotales.forEach(v => {
      conteo[v.fecha] = (conteo[v.fecha] || 0) + 1;
    });

    const labels = Object.keys(conteo).sort();

    this.lineData = {
      labels,
      datasets: [
        {
          data: labels.map(l => conteo[l]),
          borderColor: '#C9A227',
          fill: false,
          tension: 0.3
        }
      ]
    };
  }

  // ================== PAGINACIÓN ==================
  paginar() {
    this.totalPaginas = Math.max(1, Math.ceil(this.vuelosFiltrados.length / this.size));

    if (this.paginaActual >= this.totalPaginas) {
      this.paginaActual = this.totalPaginas - 1;
    }

    const start = this.paginaActual * this.size;
    this.vuelosPagina = this.vuelosFiltrados.slice(start, start + this.size);
  }

  cambiarPagina(dir: number) {
    let nueva = this.paginaActual + dir;
    if (nueva < 0) nueva = 0;
    if (nueva >= this.totalPaginas) nueva = this.totalPaginas - 1;
    this.paginaActual = nueva;
    this.paginar();
  }

  irPagina(i: number) {
    this.paginaActual = i;
    this.paginar();
  }

  // ================== RADAR ==================
  generarRadar(stats: any) {
    if (!stats) stats = {
      tecnicaAterrizaje: 0,
      maniobras: 0,
      comunicacionRadio: 0,
      seguimientoInstrucciones: 0,
      puntualidad: 0,
      comportamiento: 0,
    };

    this.radarData = {
      labels: [
        'Aterrizaje', 'Maniobras', 'Radio',
        'Instrucciones', 'Puntualidad', 'Comportamiento'
      ],
      datasets: [
        {
          label: 'Rendimiento',
          data: [
            stats.tecnicaAterrizaje,
            stats.maniobras,
            stats.comunicacionRadio,
            stats.seguimientoInstrucciones,
            stats.puntualidad,
            stats.comportamiento,
          ],
          backgroundColor: 'rgba(0,48,96,0.25)',
          borderColor: '#C9A227',
          borderWidth: 2,
          pointBackgroundColor: '#003060',
        },
      ],
    };

    this.radarOptions = {
      responsive: true,
      scales: { r: { suggestedMin: 0, suggestedMax: 10 } }
    };
  }
}
