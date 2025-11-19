import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClimaService } from '../../../services/clima.service';

declare var google: any;

@Component({
  selector: 'app-condiciones-vuelo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './condiciones-vuelo.html',
  styleUrls: ['./condiciones-vuelo.css']
})
export class CondicionesVueloComponent implements OnInit {

  clima: any = null;
  estadoVuelo = "Cargando...";
  colorEstado = "gray";

  // Lugar por defecto: El Salvador
  lat = 13.6894;
  lon = -89.1872;

  map: any;
  lluviaCircle: any;
  nubesCircle: any;

  constructor(private climaService: ClimaService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.cargarClima();
      this.inicializarMapa();
    }, 200);
  }

  // ===== CLIMA =====
  cargarClima() {
    this.climaService.obtenerClima(this.lat, this.lon).subscribe(data => {
      const current = data.current;
      this.clima = current;

      const viento = current.wind_speed_10m;
      const rafagas = current.wind_gusts_10m;
      const lluvia = current.precipitation;
      const visibilidad = current.visibility / 1000;
      const nubes = current.cloud_cover;

      if (lluvia > 1 || rafagas > 35 || visibilidad < 5) {
        this.estadoVuelo = "No apto para volar";
        this.colorEstado = "#dc3545";
      }
      else if (viento > 20 || nubes > 70) {
        this.estadoVuelo = "Volar con precaución";
        this.colorEstado = "#ffc107";
      }
      else {
        this.estadoVuelo = "Apto para volar";
        this.colorEstado = "#198754";
      }
    });
  }

  // ===== MAPA =====
  inicializarMapa() {
    setTimeout(() => {

      this.map = new google.maps.Map(
        document.getElementById("googleMap"),
        {
          center: { lat: this.lat, lng: this.lon },
          zoom: 9
        }
      );

      new google.maps.Marker({
        position: { lat: this.lat, lng: this.lon },
        map: this.map
      });

      this.dibujarOverlays();

    }, 300);
  }

  dibujarOverlays() {
    this.climaService.obtenerClima(this.lat, this.lon).subscribe((data) => {
      const c = data.current;

      // Lluvia (mínimo para que se vea)
      const lluviaInt = Math.max(c.precipitation * 20000, 5000);

      if (this.lluviaCircle) this.lluviaCircle.setMap(null); // borrar si existe

      this.lluviaCircle = new google.maps.Circle({
        strokeColor: "#0066ff",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "#3399ff",
        fillOpacity: 0.25,
        map: this.map,
        center: { lat: this.lat, lng: this.lon },
        radius: lluviaInt,
      });

      // Nubosidad (mínimo para que se vea)
      const nubesInt = Math.max(c.cloud_cover * 1000, 10000);

      if (this.nubesCircle) this.nubesCircle.setMap(null);

      this.nubesCircle = new google.maps.Circle({
        strokeColor: "#666666",
        strokeOpacity: 0.7,
        strokeWeight: 1,
        fillColor: "#999999",
        fillOpacity: 0.15,
        map: this.map,
        center: { lat: this.lat, lng: this.lon },
        radius: nubesInt,
      });
    });
  }

  // ===== CAMBIAR ZONA MANUAL =====
  actualizarZona() {
    if (!this.lat || !this.lon) return;

    // Cambiar centro del mapa
    this.map.setCenter({ lat: this.lat, lng: this.lon });

    // Volver a cargar clima y radar
    this.cargarClima();
    this.dibujarOverlays();
  }
}
