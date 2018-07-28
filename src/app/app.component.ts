import {Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth-service/auth.service';
import { ControlService } from './services/control/control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened: boolean;
  constructor(public authService: AuthService,
              private controlService: ControlService) {
    this.opened = false;
  }

  ngOnInit(): void {
    this.controlService.initSocket();
  }

  powerOff(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'set-power-off';
    const pkg = {
      action: signature
    };
    this.controlService.send(JSON.stringify(pkg));
  }

  reboot(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'set-reboot';
    const pkg = {
      action: signature
    };
    this.controlService.send(JSON.stringify(pkg));
  }
}
