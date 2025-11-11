import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avioneta } from '../models/avioneta.model';

@Injectable({
  providedIn: 'root'
})
export class AvionetasService {
  private apiUrl = 'http://localhost:8080/api/avionetas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Avioneta[]> {
    return this.http.get<Avioneta[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Avioneta> {
    return this.http.get<Avioneta>(`${this.apiUrl}/${id}`);
  }

  guardar(avioneta: Avioneta): Observable<Avioneta> {
    return this.http.post<Avioneta>(this.apiUrl, avioneta);
  }

  actualizar(id: number, avioneta: Avioneta): Observable<Avioneta> {
    return this.http.put<Avioneta>(`${this.apiUrl}/${id}`, avioneta);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
