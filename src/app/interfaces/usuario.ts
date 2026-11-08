
export type RolUsuario = 'SUPER-ADMIN-ROLE' | 'USER';

export interface UsuarioInfo {
  userName: string;
  correo: string;
  password: string;
  rol: RolUsuario;
}
