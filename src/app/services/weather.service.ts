import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class WeatherService {

  private baseUrl = 'http://localhost:8080/api/weather';

  constructor(private http: HttpClient) {}

  climaActual(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/current`, {
      params: { lat, lon }
    });
  }
}

