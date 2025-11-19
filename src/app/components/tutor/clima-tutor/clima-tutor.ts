import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClimaService } from '../../../services/clima.service';

@Component({
  selector: 'app-clima-tutor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clima-tutor.html',
  styleUrls: ['./clima-tutor.css']
})
export class ClimaTutorComponent implements OnInit {

  cargando = true;
  clima: any = null;

  constructor(private climaService: ClimaService) {}

  ngOnInit() {
    const lat = 13.6929;
    const lon = -89.2182;

    this.climaService.obtenerClima(lat, lon).subscribe(data => {
      this.clima = data.current;   // ⬅️ AHORA ES "current"
      this.cargando = false;
    });
  }

  getDescripcion(code: number): string {
    const map: any = {
      0: 'Despejado',
      1: 'Mayormente claro',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla congelante',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos fuertes',
    };
    return map[code] ?? 'Clima desconocido';
  }
}
