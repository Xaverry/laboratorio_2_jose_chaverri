import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Permitir acceso a cualquier usuario autenticado
  if (authService.estaAutenticado()) {
    return true;
  }

  // Si no hay sesión, redirigir al Login
  return router.createUrlTree(['/login']);

};
