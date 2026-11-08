
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  authService = inject(AuthService);
  router = inject(Router);

  registroForm = new FormGroup({
    userName: new FormControl(''),
    correo: new FormControl(''),
    password: new FormControl(''),
    confirmarPassword: new FormControl(''),
  });

  registrar() {

    const userName = this.registroForm.value.userName?.trim() ?? '';
    const correo = this.registroForm.value.correo?.trim() ?? '';
    const password = this.registroForm.value.password ?? '';
    const confirmarPassword =
      this.registroForm.value.confirmarPassword ?? '';

    if (!userName || !correo || !password || !confirmarPassword) {
      alert('Debe completar todos los campos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert('Ingrese un correo electrónico válido');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const registrado = this.authService.registrarUsuario(
      userName,
      correo,
      password
    );

    if (!registrado) {
      alert('El nombre de usuario o correo ya está registrado');
      return;
    }

    alert('Usuario registrado correctamente. Ya puede iniciar sesión.');

    this.router.navigate(['/login']);
  }

}
