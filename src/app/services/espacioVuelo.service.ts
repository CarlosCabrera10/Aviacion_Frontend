import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EspacioVuelo } from '../models/espacioVuelo.model';

@Injectable({
  providedIn: 'root'
})
export class EspacioVueloService {
  private apiUrl = 'http://localhost:8080/api/espacios';

  constructor(private http: HttpClient) {}

  // Genera los headers con JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({ 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Listar todos los espacios
  listar(): Observable<EspacioVuelo[]> {
    return this.http.get<EspacioVuelo[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Obtener por ID
  obtenerPorId(id: number): Observable<EspacioVuelo> {
    return this.http.get<EspacioVuelo>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Actualizar espacio
  actualizar(id: number, espacio: EspacioVuelo): Observable<EspacioVuelo> {
    return this.http.put<EspacioVuelo>(`${this.apiUrl}/${id}`, espacio, { headers: this.getAuthHeaders() });
  }

    // Activar espacio
  activar(id: number): Observable<EspacioVuelo> {
    return this.http.put<EspacioVuelo>(
      `${this.apiUrl}/${id}/activar`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Opcional: activar/desactivar
  desactivar(id: number): Observable<EspacioVuelo> {
    return this.http.put<EspacioVuelo>(`${this.apiUrl}/${id}/desactivar`, {}, { headers: this.getAuthHeaders() });
  }
}
