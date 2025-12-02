import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  username: string;
  password: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Usuarios predefinidos
  private users: User[] = [
    {
      username: 'admin',
      password: 'admin123',
      name: 'Administrador',
      role: 'admin'
    },
    {
      username: 'usuario',
      password: 'usuario123',
      name: 'Usuario Demo',
      role: 'user'
    }
  ];

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    // Verificar si hay sesión guardada de forma segura (SSR-safe)
    const storage = this.getStorage();
    const savedUser = storage?.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }
  }

  private getStorage(): Storage | null {
    try {
      if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
        return null;
      }
      return window.localStorage;
    } catch {
      return null;
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      const storage = this.getStorage();
      storage?.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    const storage = this.getStorage();
    storage?.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getUsers(): User[] {
    return this.users;
  }
}
