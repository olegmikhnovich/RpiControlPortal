import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { ControlService } from '../../services/control/control.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements  OnInit {
  ioConnection: any;
  fieldFormControl: FormControl;
  hide: boolean;
  invalidAuth: boolean;

  constructor(private controlService: ControlService,
              private authService: AuthService) {
    this.fieldFormControl = new FormControl('', [
      Validators.required
    ]);
    this.hide = true;
    this.invalidAuth = false;
  }

  ngOnInit(): void {
    const date = AuthService.getAuthDate();
    if (date.getTime() - new Date().getTime() >= 0) {
      this.authService.passLogin('device-settings');
    } else {
      this.initIoConnection();
    }
  }

  private initIoConnection(): void {
    this.ioConnection = this.controlService.onMessage()
      .subscribe((message: string) => {
        if (message === 'OK') {
          this.authService.login();
        } else {
          this.invalidAuth = true;
        }
      });
  }

  onSubmit(login: string, pwd: string) {
    if (this.fieldFormControl.hasError('required') ||
      !this.controlService.isConnected()) { return; }
    const pkg = {
      action: 'auth',
      login: login,
      pwd: pwd
    };
    this.controlService.send(JSON.stringify(pkg));
  }
}
