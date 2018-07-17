import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;
  redirectUrl: string;

  constructor(private router: Router) {
  }

  private static getExpiresTime(): string {
    const date = new Date();
    const minutes = 30;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    return date.toString();
  }

  static getAuthDate(): Date {
    return new Date(window.sessionStorage.getItem('auth'));
  }

  login() {
    window.sessionStorage.setItem('auth', AuthService.getExpiresTime());
    this._isLoggedIn = true;
    this.router.navigate(['device-settings']);
  }

  passLogin(route: string) {
    this._isLoggedIn = true;
    this.router.navigate([route]);
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
}
