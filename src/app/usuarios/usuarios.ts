import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {

  authService = inject(AuthService);

  usuarios = this.authService.getUsuarios();

}
