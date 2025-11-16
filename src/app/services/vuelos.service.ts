import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vuelo } from '../models/vuelos.model';

@Injectable({
  providedIn: 'root'
})
export class VuelosService {
  private apiUrl = 'http://localhost:8080/api/vuelos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  listar(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  obtenerPorId(id: number): Observable<Vuelo> {
    return this.http.get<Vuelo>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  guardar(vuelo: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(this.apiUrl, vuelo, { headers: this.getAuthHeaders() });
  }

  actualizar(id: number, vuelo: Vuelo): Observable<Vuelo> {
    return this.http.put<Vuelo>(`${this.apiUrl}/${id}`, vuelo, { headers: this.getAuthHeaders() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  listarPorTutor(idTutor: number): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.apiUrl}/tutor/${idTutor}`, { headers: this.getAuthHeaders() });
  }
  
}
