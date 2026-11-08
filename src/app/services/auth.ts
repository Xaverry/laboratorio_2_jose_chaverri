
import { Injectable, signal } from '@angular/core';
import { UsuarioInfo } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly STORAGE_KEY = 'usuarios_demo';
  private readonly SESSION_KEY = 'sesion_demo';

  private readonly usuariosIniciales: UsuarioInfo[] = [
    {
      userName: 'admin',
      correo: 'admin@demo.local',
      password: 'Admin123!',
      rol: 'SUPER-ADMIN-ROLE',
    },
    {
      userName: 'usuario',
      correo: 'usuario@demo.local',
      password: 'Usuario123!',
      rol: 'USER',
    },
  ];

  // Usuario que tiene la sesión iniciada
  usuarioActual = signal<UsuarioInfo | null>(null);

  constructor() {
    this.inicializarUsuarios();
    this.recuperarSesion();
  }

  private inicializarUsuarios(): void {
    const usuariosGuardados = localStorage.getItem(this.STORAGE_KEY);

    if (usuariosGuardados === null) {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.usuariosIniciales)
      );
    }
  }

  getUsuarios(): UsuarioInfo[] {
    const datos = localStorage.getItem(this.STORAGE_KEY);

    if (!datos) {
      return [];
    }

    return JSON.parse(datos) as UsuarioInfo[];
  }

  // LOGIN - validacion de credenciales
  iniciarSesion(identificador: string, password: string): boolean {

    const usuario = this.getUsuarios().find(
      u =>
        (u.userName === identificador || u.correo === identificador) &&
        u.password === password
    );

    if (!usuario) {
      return false;
    }

    this.usuarioActual.set(usuario);

    // Guardamos solamente el identificador de la sesión
    localStorage.setItem(this.SESSION_KEY, usuario.userName);

    return true;
  }

  // Recuperar la sesión al recargar Angular
  private recuperarSesion(): void {

    const userName = localStorage.getItem(this.SESSION_KEY);

    if (!userName) {
      return;
    }

    const usuario = this.getUsuarios().find(
      u => u.userName === userName
    );

    if (usuario) {
      this.usuarioActual.set(usuario);
    } else {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  // LOGOUT - Cerrar sesión
  cerrarSesion(): void {
    this.usuarioActual.set(null);
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Verifica si hay un usuario autenticado
  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  // Comprueba si es administrador
  esAdmin(): boolean {
    return this.usuarioActual()?.rol === 'SUPER-ADMIN-ROLE';
  }


  
  // REGISTRO - Crear un usuario con rol USER
  registrarUsuario(
    userName: string,
    correo: string,
    password: string
  ): boolean {

    const usuarios = this.getUsuarios();

    const existe = usuarios.some(
      u =>
        u.userName.toLowerCase() === userName.toLowerCase() ||
        u.correo.toLowerCase() === correo.toLowerCase()
    );

    if (existe) {
      return false;
    }

    const nuevoUsuario: UsuarioInfo = {
      userName,
      correo,
      password,
      rol: 'USER',
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(usuarios)
    );

    return true;
  }

}
