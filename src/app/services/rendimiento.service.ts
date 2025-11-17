import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rendimiento } from '../models/rendimiento.model';

@Injectable({
  providedIn: 'root'
})
export class RendimientoService {

  private apiUrl = 'http://localhost:8080/api/rendimientos';

  constructor(private http: HttpClient) {}

  /** Obtener rendimiento por vuelo */
  obtenerPorVuelo(idVuelo: number): Observable<Rendimiento | null> {
    return this.http.get<Rendimiento>(`${this.apiUrl}/vuelo/${idVuelo}`);
  }

  /** Guardar o actualizar rendimiento */
  guardar(idVuelo: number, data: Rendimiento): Observable<Rendimiento> {
    return this.http.post<Rendimiento>(`${this.apiUrl}/vuelo/${idVuelo}`, data);
  }
}
