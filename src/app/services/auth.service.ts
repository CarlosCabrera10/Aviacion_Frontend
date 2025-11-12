import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private rolSubject = new BehaviorSubject<string | null>(localStorage.getItem('rol'));
  rol$ = this.rolSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { correo, contrasena })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          const rol = response.usuario.rol;
          localStorage.setItem('rol', rol);
          this.rolSubject.next(rol);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.rolSubject.next(null);
  }

  getRol() {
    return this.rolSubject.getValue();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
