import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Vuelo } from '../models/vuelos.model';

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  private API_URL = 'http://localhost:8080/api/tutor';

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener alumnos del tutor */
  obtenerAlumnos(idTutor: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/${idTutor}/alumnos`);
  }

  /** 🔹 Obtener vuelos filtrados por alumno */
  obtenerVuelosPorAlumno(idAlumno: number): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.API_URL}/${idAlumno}/vuelos`);
  }



  /** 🔹 Obtener detalle completo del alumno */
obtenerDetalleAlumno(idAlumno: number): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.API_URL}/alumno/${idAlumno}`);
}

/** 🔹 Obtener estadísticas (para el radar) */
obtenerEstadisticas(idAlumno: number): Observable<any> {
  return this.http.get(`${this.API_URL}/alumno/${idAlumno}/estadisticas`);
}

/** 🔹 Obtener vuelos del alumno */
obtenerVuelosAlumno(idAlumno: number): Observable<Vuelo[]> {
  return this.http.get<Vuelo[]>(`${this.API_URL}/alumno/${idAlumno}/vuelos`);
}



}
