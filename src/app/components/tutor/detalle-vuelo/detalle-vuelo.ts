import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { BaseChartDirective, provideCharts } from 'ng2-charts';
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
  ChartData,
  ChartOptions
} from 'chart.js';

import { VuelosService } from '../../../services/vuelos.service';
import { RendimientoService } from '../../../services/rendimiento.service';
import { Vuelo } from '../../../models/vuelos.model';
import { Rendimiento } from '../../../models/rendimiento.model';
import { Avioneta } from '../../../models/avioneta.model';    

// REGISTRO RADAR
Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-detalle-vuelo',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  providers: [provideCharts()],
  templateUrl: './detalle-vuelo.html',
  styleUrls: ['./detalle-vuelo.css']
})
export class DetalleVueloComponent implements OnInit {

  idVuelo!: number;

  vuelo: Vuelo | null = null;
  rendimiento: Rendimiento | null = null;

  cargando = true;
  error: string | null = null;

  radarData!: ChartData<'radar'>;
  radarOptions!: ChartOptions<'radar'>;

  constructor(
    private route: ActivatedRoute,
    private vuelosService: VuelosService,
    private rendimientoService: RendimientoService
  ) {}

  ngOnInit(): void {
    this.idVuelo = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    // 1) Obtener vuelo
    this.vuelosService.obtenerPorId(this.idVuelo).subscribe({
      next: v => {
        this.vuelo = v;
      },
      error: () => {
        this.error = 'No se pudo obtener la información del vuelo';
        this.cargando = false;
      }
    });

    // 2) Obtener rendimiento del vuelo
    this.rendimientoService.obtenerPorVuelo(this.idVuelo).subscribe({
      next: r => {
        this.rendimiento = r;
        this.configurarRadar(r);
        this.cargando = false;
      },
      error: () => {
        this.rendimiento = null;
        this.configurarRadar(null);
        this.cargando = false;
      }
    });
  }

  calcularPromedio(): number {
  if (!this.rendimiento) return 0;

  const valores = [
    this.rendimiento.tecnicaAterrizaje ?? 0,
    this.rendimiento.maniobras ?? 0,
    this.rendimiento.comunicacionRadio ?? 0,
    this.rendimiento.seguimientoInstrucciones ?? 0,
    this.rendimiento.puntualidad ?? 0,
    this.rendimiento.comportamiento ?? 0
  ];

  const suma = valores.reduce((acc, v) => acc + v, 0);
  return +(suma / valores.length).toFixed(1); // redondeado 1 decimal
}


  private configurarRadar(r: Rendimiento | null) {
    const tecnica = r?.tecnicaAterrizaje ?? 0;
    const maniobras = r?.maniobras ?? 0;
    const radio = r?.comunicacionRadio ?? 0;
    const instrucciones = r?.seguimientoInstrucciones ?? 0;
    const puntualidad = r?.puntualidad ?? 0;
    const comportamiento = r?.comportamiento ?? 0;

    this.radarData = {
      labels: [
        'Aterrizaje',
        'Maniobras',
        'Radio',
        'Instrucciones',
        'Puntualidad',
        'Comportamiento'
      ],
      datasets: [
        {
          label: 'Rendimiento del vuelo',
          data: [
            tecnica,
            maniobras,
            radio,
            instrucciones,
            puntualidad,
            comportamiento
          ],
          backgroundColor: 'rgba(0,48,96,0.25)',
          borderColor: '#C9A227',
          borderWidth: 2,
          pointBackgroundColor: '#003060'
        }
      ]
    };

    this.radarOptions = {
      responsive: true,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 10
        }
      }
    };
  }
}
