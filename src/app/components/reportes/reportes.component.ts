import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ReportesEstadisticasService } from '../../services/reportes-estadisticas.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <!-- BOTÓN SUPERIOR PROFESIONAL -->
    <button class="export-btn" (click)="exportPDF()">
      📄 Exportar reporte
    </button>

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="reportes-container" #reportesContainer>

      <h2 class="titulo-dashboard">📊 Reportes Estadísticos</h2>

      <!-- TARJETAS DE GRÁFICOS -->
      <div class="chart-card">
        <h3>Actividad por Día</h3>
        <canvas #chartDia></canvas>
      </div>

      <div class="chart-card">
        <h3>Actividad por Hora</h3>
        <canvas #chartHora></canvas>
      </div>

      <div class="chart-card">
        <h3>Uso de Avionetas</h3>
        <canvas #chartAvionetas></canvas>
      </div>

      <div class="chart-card">
        <h3>Tutores Activos</h3>
        <canvas #chartTutores></canvas>
      </div>

      <div class="chart-card">
        <h3>Alumnos Activos</h3>
        <canvas #chartAlumnos></canvas>
      </div>

      <div class="chart-card">
        <h3>Vuelos por Tutor</h3>
        <canvas #chartVuelosTutor></canvas>
      </div>

      <div class="chart-card">
        <h3>Horas de Vuelo por Avioneta</h3>
        <canvas #chartHorasAvionetas></canvas>
      </div>

      <!-- HEATMAP -->
      <div class="chart-card heatmap-card">
        <h3>Mapa de Calor – Actividad por Día y Hora</h3>

        <div class="heatmap-toolbar">
          <label>
            Desde
            <input type="date" [(ngModel)]="filtros.fecha_inicio" (change)="loadMapaCalor()" />
          </label>
          <label>
            Hasta
            <input type="date" [(ngModel)]="filtros.fecha_fin" (change)="loadMapaCalor()" />
          </label>
          <label class="num-toggle">
            <input type="checkbox" [(ngModel)]="showNumbers" (change)="loadMapaCalor()" />
            Mostrar números
          </label>
        </div>

        <div *ngIf="loadingHeatmap">Cargando mapa de calor…</div>

        <div *ngIf="!loadingHeatmap" class="overflow-auto">
          <table class="heatmap-table">
            <thead>
              <tr>
                <th class="sticky-left">Día / Hora</th>
                <th *ngFor="let h of horas">{{ h }}:00</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let dia of diasOrdenados">
                <td class="sticky-left capitalize">{{ dia }}</td>

                <td *ngFor="let hora of horas"
                    [ngStyle]="{ 'background': getColor(mapaCalor?.[dia]?.[hora] ?? 0) }"
                    [title]="(mapaCalor?.[dia]?.[hora] ?? 0) + ' vuelos'">
                  
                  <span *ngIf="showNumbers" class="heat-number">
                    {{ mapaCalor?.[dia]?.[hora] ?? 0 }}
                  </span>

                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `,

  styles: [`

    /* ---------------- BOTÓN PROFESIONAL ---------------- */
    .export-btn {
      position: fixed;
      top: 18px;
      right: 28px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
      transition: 0.2s ease;
      z-index: 9999;
    }
    .export-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.22);
    }

    /* ---------------- CONTENEDOR ---------------- */
    .reportes-container {
      max-width: calc(100% - 200px);
      margin-left: 200px;
      padding: 2rem;
      background: #f5f7fb;
      font-family: "Inter", sans-serif;
    }

    .titulo-dashboard {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 22px;
      color: #0f1f3d;
    }

    /* ---------------- TARJETAS ---------------- */
    .chart-card {
      background: white;
      padding: 20px;
      border-radius: 14px;
      margin-bottom: 26px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.06);
      transition: 0.2s ease;
    }

    .chart-card:hover {
      box-shadow: 0 10px 24px rgba(0,0,0,0.1);
    }

    h3 {
      margin-bottom: 12px;
      font-size: 17px;
      font-weight: 600;
      color: #1e293b;
    }

    canvas {
      width: 100% !important;
      height: 260px !important;
    }

    /* ---------------- HEATMAP ---------------- */
    .heatmap-toolbar {
      margin-bottom: 14px;
      display: flex;
      gap: 18px;
      font-size: 14px;
      align-items: center;
    }

    .heatmap-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .heatmap-table th,
    .heatmap-table td {
      border: 1px solid rgba(0,0,0,0.06);
      padding: 6px;
      text-align: center;
      min-width: 42px;
      height: 40px;
    }

    .sticky-left {
      position: sticky;
      left: 0;
      background: white;
      font-weight: 600;
    }

    .heat-number {
      font-weight: 700;
      color: white;
    }

    @media (max-width: 900px) {
      .reportes-container {
        margin-left: 0;
      }
      .export-btn {
        right: 12px;
      }
    }
  `]
})

export class ReportesComponent implements OnInit, OnDestroy {

  @ViewChild('chartDia', { static: true }) private chartDiaRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartHora', { static: true }) private chartHoraRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartAvionetas', { static: true }) private chartAvionetasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartTutores', { static: true }) private chartTutoresRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartAlumnos', { static: true }) private chartAlumnosRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartVuelosTutor', { static: true }) private chartVuelosTutorRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartHorasAvionetas', { static: true }) private chartHorasAvionetasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reportesContainer', { static: true }) private reportesContainerRef!: ElementRef<HTMLDivElement>;

  chartDia?: Chart;
  chartHora?: Chart;
  chartAvionetas?: Chart;
  chartTutores?: Chart;
  chartAlumnos?: Chart;
  chartVuelosTutor?: Chart;
  chartHorasAvionetas?: Chart;

  private subs: Subscription[] = [];

  // Heatmap state
  mapaCalor: { [dia: string]: { [hora: number]: number } } = {};
  loadingHeatmap = false;
  showNumbers = false;
  horas: number[] = Array.from({ length: 24 }, (_, i) => i); // 0..23

  // Ensure Spanish day order matching backend
  diasOrdenados = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

  // minimal filtros used for heatmap (you can extend to match your UI)
  filtros: { fecha_inicio: string, fecha_fin: string } = {
    fecha_inicio: this.getDefaultStartDate(),
    fecha_fin: this.getToday()
  };

  constructor(private reportesService: ReportesEstadisticasService) {}

  ngOnInit() {
    this.cargarReportes();
  }

  ngOnDestroy(): void {
    this.chartDia?.destroy();
    this.chartHora?.destroy();
    this.chartAvionetas?.destroy();
    this.chartTutores?.destroy();
    this.chartAlumnos?.destroy();
    this.subs.forEach(s => s.unsubscribe());
  }

  // ---------- helper dates ----------
  getDefaultStartDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  // ---------- load all reports ----------
  cargarReportes() {
    this.loadChartDia();
    this.loadChartHora();
    this.loadChartAvionetas();
    this.loadChartTutores();
    this.loadChartAlumnos();
    this.loadChartVuelosPorTutor();
    this.loadChartHorasVueloAvionetas();
    this.loadMapaCalor(); // <-- our new grid heatmap
  }

  // ---------- existing charts (unchanged logic) ----------
  loadChartDia() {
    const sub = this.reportesService.actividadPorDia().subscribe({
      next: (data: any) => {
        this.chartDia?.destroy();
        const ctx = this.chartDiaRef.nativeElement.getContext('2d')!;
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];

        const grad = ctx.createLinearGradient(0, 0, 0, 200);
        grad.addColorStop(0, 'rgba(58,123,213,1)');
        grad.addColorStop(1, 'rgba(0,210,255,0.6)');

        const diaConfig: any = {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Vuelos por Día',
              data: values,
              borderColor: grad,
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: 'white',
              pointBorderColor: 'rgba(58,123,213,0.9)',
              fill: true,
              backgroundColor: 'rgba(58,123,213,0.12)',
              tension: 0.25
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            plugins: { legend: { display: false } },
            scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.04)' } } }
          }
        };
        this.chartDia = new Chart(ctx, diaConfig);
      },
      error: (err: any) => console.error('Error cargando actividad-por-dia', err)
    });
    this.subs.push(sub);
  }

  loadChartHora() {
    const sub = this.reportesService.actividadPorHora().subscribe({
      next: (data: any) => {
        this.chartHora?.destroy();
        const ctx = this.chartHoraRef.nativeElement.getContext('2d')!;
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];
        const palette = values.map((_, i) => `hsl(${200 - (i * 160 / Math.max(1, labels.length))},70%,45%)`);

        const horaConfig: any = {
          type: 'bar',
          data: { labels, datasets: [{ label: 'Vuelos por Hora', data: values, backgroundColor: palette, borderRadius: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(0,0,0,0.04)' } } } }
        };
        this.chartHora = new Chart(ctx, horaConfig);
      },
      error: (err: any) => console.error('Error cargando actividad-por-hora', err)
    });
    this.subs.push(sub);
  }

  loadChartAvionetas() {
    const sub = this.reportesService.usoAvionetas().subscribe({
      next: (data: any) => {
        this.chartAvionetas?.destroy();
        const ctx = this.chartAvionetasRef.nativeElement.getContext('2d')!;
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];
        const palette = labels.map((_, i) => `hsl(${i * (360 / Math.max(1, labels.length))},70%,50%)`);
        const avionetasConfig: any = {
          type: 'doughnut',
          data: { labels, datasets: [{ data: values, backgroundColor: palette, borderWidth: 1, hoverOffset: 8 }] },
          options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, plugins: { legend: { position: 'right' } } }
        };
        this.chartAvionetas = new Chart(ctx, avionetasConfig);
      },
      error: (err: any) => console.error('Error cargando uso-avionetas', err)
    });
    this.subs.push(sub);
  }

  loadChartTutores() {
    const sub = this.reportesService.tutoresActivos().subscribe({
      next: (data: any) => {
        this.chartTutores?.destroy();
        const ctx = this.chartTutoresRef.nativeElement.getContext('2d')!;
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];
        const palette = values.map((_, i) => `rgba(99,102,241,${0.7 - Math.min(0.5, i / Math.max(1, values.length))})`);
        const tutoresConfig: any = {
          type: 'bar',
          data: { labels, datasets: [{ label: 'Vuelos por Tutor', data: values, backgroundColor: palette, borderRadius: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, plugins: { legend: { display: false } } }
        };
        this.chartTutores = new Chart(ctx, tutoresConfig);
      },
      error: (err: any) => console.error('Error cargando tutores-activos', err)
    });
    this.subs.push(sub);
  }

  loadChartAlumnos() {
    const sub = this.reportesService.alumnosActivos().subscribe({
      next: (data: any) => {
        this.chartAlumnos?.destroy();
        const ctx = this.chartAlumnosRef.nativeElement.getContext('2d')!;
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];
        const palette = values.map((_, i) => `hsl(${220 - (i * 160 / Math.max(1, labels.length))},60%,50%)`);
        const alumnosConfig: any = {
          type: 'bar',
          data: { labels, datasets: [{ label: 'Vuelos por Alumno', data: values, backgroundColor: palette, borderRadius: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, plugins: { legend: { display: false } } }
        };
        this.chartAlumnos = new Chart(ctx, alumnosConfig);
      },
      error: (err: any) => console.error('Error cargando alumnos-activos', err)
    });
    this.subs.push(sub);
  }

  // ---------- nuevos charts usando nuevos endpoints ----------
  loadChartVuelosPorTutor() {
    const sub = this.reportesService.vuelosPorTutor().subscribe({
      next: (data: any) => {
        this.chartVuelosTutor?.destroy();
        const ctx = this.chartVuelosTutorRef.nativeElement.getContext('2d')!;
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];
        const cfg: any = {
          type: 'bar',
          data: { labels, datasets: [{ data: values, backgroundColor: labels.map((_, i) => `hsl(${220 - i * 20},60%,55%)`) }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(0,0,0,0.04)' } } } }
        };
        this.chartVuelosTutor = new Chart(ctx, cfg);
      },
      error: (err: any) => console.error('Error cargando vuelos-por-tutor', err)
    });
    this.subs.push(sub);
  }

  loadChartHorasVueloAvionetas() {
    const sub = this.reportesService.horasVueloAvionetas().subscribe({
      next: (data: any) => {
        this.chartHorasAvionetas?.destroy();
        const ctx = this.chartHorasAvionetasRef.nativeElement.getContext('2d')!;
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];
        const cfg: any = {
          type: 'bar',
          data: { labels, datasets: [{ data: values, backgroundColor: labels.map((_, i) => `hsl(${i * 30 % 360},70%,50%)`) }] },
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(0,0,0,0.04)' } } } }
        };
        this.chartHorasAvionetas = new Chart(ctx, cfg);
      },
      error: (err: any) => console.error('Error cargando horas-vuelo-avionetas', err)
    });
    this.subs.push(sub);
  }

  // Export visible report area to PDF using html2canvas + jsPDF
  async exportPDF() {
    try {
      const el = this.reportesContainerRef?.nativeElement as HTMLElement | undefined;
      if (!el) {
        console.error('Contenedor de reportes no encontrado');
        return;
      }
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
      let y = 0;
      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, y, pageWidth, pdfHeight);
      } else {
        // If image taller than a single page, split vertically
        const canvasH = canvas.height;
        const pxPerMm = imgProps.height / pdfHeight;
        let srcY = 0;
        while (srcY < canvasH) {
          const sliceH = Math.min(canvasH - srcY, Math.round(pageHeight * pxPerMm));
          const tmp = document.createElement('canvas');
          tmp.width = canvas.width;
          tmp.height = sliceH;
          const tctx = tmp.getContext('2d')!;
          tctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, tmp.width, tmp.height);
          const chunkData = tmp.toDataURL('image/png');
          const chunkProps = pdf.getImageProperties(chunkData);
          const chunkPdfH = (chunkProps.height * pageWidth) / chunkProps.width;
          if (srcY > 0) pdf.addPage();
          pdf.addImage(chunkData, 'PNG', 0, 0, pageWidth, chunkPdfH);
          srcY += sliceH;
        }
      }
      pdf.save('reportes.pdf');
    } catch (e) {
      console.error('Error generando PDF', e);
    }
  }

  // ---------- Heatmap grid (calendar) ----------
  loadMapaCalor() {
    this.loadingHeatmap = true;
    // backend expects fecha strings like YYYY-MM-DD, we pass filtros
    const sub = this.reportesService.heatmapHorarios(this.filtros.fecha_inicio, this.filtros.fecha_fin).subscribe({
      next: (data: any) => {
        // Expected format from backend: { "lunes": { "0": 0, "1": 2, ... }, "martes": {...}, ... }
        // Normalize keys to numbers and ensure all hours present 0..23
        const normalized: { [dia: string]: { [hora: number]: number } } = {};
        const days = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

        for (const d of days) {
          normalized[d] = {};
          for (let h = 0; h < 24; h++) normalized[d][h] = 0;
        }

        // fill from returned data (be flexible with keys: "08", "8", "08:00")
        for (const [diaKey, hoursObj] of Object.entries(data || {})) {
          const diaLower = diaKey.toLowerCase();
          if (!normalized[diaLower]) continue;
          for (const [hk, val] of Object.entries(hoursObj as any)) {
            const hourNum = parseInt(hk.split(':')[0], 10);
            if (!Number.isNaN(hourNum) && hourNum >= 0 && hourNum < 24) {
              normalized[diaLower][hourNum] = Number(val) || 0;
            }
          }
        }

        this.mapaCalor = normalized;
        this.loadingHeatmap = false;
      },
      error: (err: any) => {
        console.error('Error cargando heatmap-horarios', err);
        this.loadingHeatmap = false;
      }
    });

    this.subs.push(sub);
  }

  getColor(valor: number): string {
    // color scale: 0 -> gray, 1..4 -> orange, 5..9 -> yellow, >=10 -> green
    if (valor >= 10) return '#2ecc71';
    if (valor >= 5) return '#f1c40f';
    if (valor >= 1) return '#e67e22';
    return '#d1d5db'; // light gray for 0
  }

}
