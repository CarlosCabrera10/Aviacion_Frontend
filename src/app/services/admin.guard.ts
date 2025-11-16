import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  if (rol === 'Administrador') return true;

  router.navigate(['/login']);
  return false;
};
