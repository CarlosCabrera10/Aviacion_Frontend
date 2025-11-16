import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const tutorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  if (rol === 'Tutor') return true;

  router.navigate(['/login']);
  return false;
};
