import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';

Chart.register(...registerables); // 🔥 NECESARIO PARA QUE SE RENDERICEN LOS GRÁFICOS

@Component({
  selector: 'app-reportes-dashboard',
  template: `
    <div class="reportes-container">

      <h2>📊 Reportes Estadísticos</h2>

      <div class="chart-card">
        <h3>Actividad por Día</h3>
        <canvas id="chartDia"></canvas>
      </div>

      <div class="chart-card">
        <h3>Actividad por Hora</h3>
        <canvas id="chartHora"></canvas>
      </div>

      <div class="chart-card">
        <h3>Uso de Avionetas</h3>
        <canvas id="chartAvionetas"></canvas>
      </div>

      <div class="chart-card">
        <h3>Tutores Activos</h3>
        <canvas id="chartTutores"></canvas>
      </div>

      <div class="chart-card">
        <h3>Alumnos Activos</h3>
        <canvas id="chartAlumnos"></canvas>
      </div>

    </div>
  `,
  styles: [`
    .reportes-container {
      padding: 20px;
      width: 100%;
      background: #f4f6f9;
      box-sizing: border-box;
    }

    h2 {
      text-align: center;
      margin-bottom: 25px;
      color: #333;
      font-size: 26px;
    }

    .chart-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    h3 {
      margin-bottom: 10px;
      color: #444;
    }

    canvas {
      width: 100% !important;
      max-height: 380px;
    }
  `]
})
export class ReportesComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/reportes';

  // Referencias para destruir los charts
  chartDia: any;
  chartHora: any;
  chartAvionetas: any;
  chartTutores: any;
  chartAlumnos: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.loadChartDia();
    this.loadChartHora();
    this.loadChartAvionetas();
    this.loadChartTutores();
    this.loadChartAlumnos();
  }

  // ======================================
  //         ACTIVIDAD POR DÍA
  // ======================================
  loadChartDia() {
    this.http.get<any>(`${this.apiUrl}/actividad-por-dia`).subscribe(data => {

      if (this.chartDia) this.chartDia.destroy();

      this.chartDia = new Chart("chartDia", {
        type: 'line',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: "Vuelos por Día",
            data: Object.values(data),
            borderColor: "blue",
            borderWidth: 2,
            fill: false,
            tension: 0.2
          }]
        }
      });

    });
  }

  // ======================================
  //         ACTIVIDAD POR HORA
  // ======================================
  loadChartHora() {
    this.http.get<any>(`${this.apiUrl}/actividad-por-hora`).subscribe(data => {

      if (this.chartHora) this.chartHora.destroy();

      this.chartHora = new Chart("chartHora", {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: "Vuelos por Hora",
            data: Object.values(data),
            backgroundColor: "rgba(54, 162, 235, 0.7)"
          }]
        }
      });

    });
  }

  // ======================================
  //         USO DE AVIONETAS
  // ======================================
  loadChartAvionetas() {
    this.http.get<any>(`${this.apiUrl}/uso-avionetas`).subscribe(data => {

      if (this.chartAvionetas) this.chartAvionetas.destroy();

      this.chartAvionetas = new Chart("chartAvionetas", {
        type: 'pie',
        data: {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: ["#007bff", "#6610f2", "#17a2b8", "#28a745", "#ffc107"]
          }]
        }
      });

    });
  }

  // ======================================
  //         TUTORES ACTIVOS
  // ======================================
  loadChartTutores() {
    this.http.get<any>(`${this.apiUrl}/tutores-activos`).subscribe(data => {

      if (this.chartTutores) this.chartTutores.destroy();

      this.chartTutores = new Chart("chartTutores", {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: "Vuelos por Tutor",
            data: Object.values(data),
            backgroundColor: "#17a2b8"
          }]
        }
      });

    });
  }

  // ======================================
  //         ALUMNOS ACTIVOS
  // ======================================
  loadChartAlumnos() {
    this.http.get<any>(`${this.apiUrl}/alumnos-activos`).subscribe(data => {

      if (this.chartAlumnos) this.chartAlumnos.destroy();

      this.chartAlumnos = new Chart("chartAlumnos", {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: "Vuelos por Alumno",
            data: Object.values(data),
            backgroundColor: "#28a745"
          }]
        }
      });

    });
  }
}
