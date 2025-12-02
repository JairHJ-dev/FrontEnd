import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    FormsModule,
    MessageModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  username = '';
  password = '';
  errorMessage = signal<string>('');
  showError = signal<boolean>(false);

  // Usuarios disponibles para referencia
  availableUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'usuario', password: 'usuario123' }
  ];

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  onLogin() {
    this.showError.set(false);
    const username = (this.username ?? '').trim();
    const password = (this.password ?? '').trim();

    if (!username || !password) {
      this.errorMessage.set('Por favor ingresa usuario y contraseña');
      this.showError.set(true);
      return;
    }

    const success = this.authService.login(username, password);
    
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set('Usuario o contraseña incorrectos');
      this.showError.set(true);
    }
  }
}
