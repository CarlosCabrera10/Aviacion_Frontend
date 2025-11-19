import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClimaService {

  constructor(private http: HttpClient) {}

  /** 🌤️ Clima actual y condiciones para volar (Open-Meteo) */
  obtenerClima(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,cloud_cover,visibility&timezone=auto`
    );
  }

  /** 🌧️ Mapa de nubes o lluvia (Tile layer) — NO necesita API */
  obtenerTiles(tipo: 'rain' | 'clouds'): string {
    if (tipo === 'rain')
      return 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=66088af6a39b306684aa2ce9bc16ed73';

    return 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=66088af6a39b306684aa2ce9bc16ed73';
  }
}
