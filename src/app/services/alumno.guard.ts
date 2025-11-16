import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const alumnoGuard: CanActivateFn = () => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  if (rol === 'Alumno') return true;

  router.navigate(['/login']);
  return false;
};
