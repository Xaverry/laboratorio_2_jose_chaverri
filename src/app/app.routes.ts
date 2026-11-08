import { Routes } from '@angular/router';
import { Categoria } from './categoria/categoria';
import { Producto } from './producto/producto';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { Usuarios } from './usuarios/usuarios';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [

  // Ruta principal
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full',
  },

  // Rutas públicas
  {
    path: 'login',
    component: Login,
    title: 'Iniciar sesión',
  },
  {
    path: 'registro',
    component: Registro,
    title: 'Registro de usuarios',
  },

  // Rutas para cualquier usuario autenticado
  {
    path: 'productos',
    component: Producto,
    canActivate: [authGuard],
    title: 'Productos',
  },
  {
    path: 'categorias',
    component: Categoria,
    canActivate: [authGuard],
    title: 'Categorías',
  },

  // Ruta exclusiva para SUPER-ADMIN-ROLE
  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [adminGuard],
    title: 'Usuarios registrados',
  },

  // Rutas no existentes
  {
    path: '**',
    redirectTo: 'productos',
  },

];
