import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesEstadisticasService {

  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  actividadPorDia(): Observable<any> {
    return this.http.get(`${this.apiUrl}/actividad-por-dia`, {
      headers: this.getHeaders()
    });
  }

  actividadPorHora(): Observable<any> {
    return this.http.get(`${this.apiUrl}/actividad-por-hora`, {
      headers: this.getHeaders()
    });
  }

  usoAvionetas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/uso-avionetas`, {
      headers: this.getHeaders()
    });
  }

  tutoresActivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tutores-activos`, {
      headers: this.getHeaders()
    });
  }

  alumnosActivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alumnos-activos`, {
      headers: this.getHeaders()
    });
  }
}
