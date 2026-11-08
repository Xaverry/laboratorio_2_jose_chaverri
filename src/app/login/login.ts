
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    identificador: new FormControl(''),
    password: new FormControl(''),
  });

  iniciarSesion() {

    const identificador =
      this.loginForm.value.identificador?.trim() ?? '';

    const password =
      this.loginForm.value.password ?? '';

    if (!identificador || !password) {
      alert('Debe completar todos los campos');
      return;
    }

    const accesoPermitido =
      this.authService.iniciarSesion(identificador, password);

    if (!accesoPermitido) {
      alert('Usuario o contraseña incorrectos');
      return;
    }

    this.router.navigate(['/productos']);
  }

}
