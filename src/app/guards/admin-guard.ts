import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no ha iniciado sesión, enviarlo al Login
  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  // Si es administrador, permitir el acceso
  if (authService.esAdmin()) {
    return true;
  }

  // Si es USER, impedir el acceso
  return router.createUrlTree(['/productos']);

};
