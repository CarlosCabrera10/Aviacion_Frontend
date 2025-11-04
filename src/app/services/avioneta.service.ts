import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Avioneta {
  idAvioneta?: number;
  codigo: string;
  modelo: string;
  horasVuelo: number;
  estado: 'Activo' | 'Mantenimiento';
}

@Injectable({
  providedIn: 'root'
})
export class AvionetaService {

  private apiUrl = 'http://localhost:8080/api/avionetas';

  constructor(private http: HttpClient) { }

  getAvionetas(): Observable<Avioneta[]> {
    return this.http.get<Avioneta[]>(this.apiUrl);
  }

  crearAvioneta(avioneta: Avioneta): Observable<Avioneta> {
    return this.http.post<Avioneta>(this.apiUrl, avioneta);
  }

  eliminarAvioneta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
