import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherService } from '../../../services/weather.service';

@Component({
  selector: 'app-dashboard-tutor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tutor.html',
  styleUrls: ['./dashboard-tutor.css']
})
export class DashboardTutorComponent implements OnInit {

  clima: any = null;
  cargandoClima = true;

  dashboardItems = [
    {
      titulo: 'Mi Horario de Vuelos',
      descripcion: 'Consulta tus vuelos del mes en un calendario.',
      icono: 'calendar',
      ruta: '/tutor/horario'
    },
    {
      titulo: 'Actualizar Vuelos',
      descripcion: 'Marca vuelos como completados o cancelados.',
      icono: 'plane',
      ruta: '/tutor/vuelos'
    },
    {
      titulo: 'Mapa Meteorológico',
      descripcion: 'Visualiza el radar de clima en la zona de vuelo.',
      icono: 'radar',
      ruta: '/tutor/clima'
    }
  ];

  constructor(
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    // this.cargarClima();
  }

  ir(ruta: string) {
    this.router.navigate([ruta]);
  }

  /* cargarClima() {
    this.cargandoClima = true;
    const lat = 13.6894;
    const lon = -89.1872;

    this.weatherService.climaActual(lat, lon).subscribe({
      next: (data) => {
        this.clima = data;
        this.cargandoClima = false;
      },
      error: (err) => {
        console.error("Error cargando clima:", err);
        this.cargandoClima = false;
      }
    });
  } */
}
