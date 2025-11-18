import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario.model';
import { Vuelo } from '../models/vuelos.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private API_URL = 'http://localhost:8080/api/alumnos';

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener perfil del alumno */
  obtenerPerfil(idAlumno: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${idAlumno}/perfil`);
  }

  /** 🔹 Obtener todos los vuelos */
  obtenerVuelos(idAlumno: number): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.API_URL}/${idAlumno}/vuelos`);
  }

  /** 🔹 Obtener próximos vuelos */
  obtenerProximosVuelos(idAlumno: number): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.API_URL}/${idAlumno}/vuelos/proximos`);
  }

  /** 🔹 Obtener vuelo específico */
  obtenerVuelo(idAlumno: number, idVuelo: number): Observable<Vuelo> {
    return this.http.get<Vuelo>(`${this.API_URL}/${idAlumno}/vuelos/${idVuelo}`);
  }

  /** 🔹 Estadísticas (para la gráfica RADAR) */
  obtenerEstadisticas(idAlumno: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${idAlumno}/estadisticas`);
  }

  obtenerVueloEspecifico(idAlumno: number, idVuelo: number) {
  return this.http.get<Vuelo>(`${this.API_URL}/${idAlumno}/vuelos/${idVuelo}`);
}

obtenerRendimiento(idVuelo: number) {
  return this.http.get(`http://localhost:8080/api/rendimientos/vuelo/${idVuelo}`);
}

}
