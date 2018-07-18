import {Component, OnInit} from '@angular/core';
import {ControlService} from '../../services/control/control.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.component.html',
  styleUrls: ['./device-settings.component.css']
})
export class DeviceSettingsComponent implements OnInit {
  hide1: boolean;
  hide2: boolean;
  hide3: boolean;
  audioVolumeValue: number;
  deviceNameModel: string;

  constructor(private controlService: ControlService,
              private snackBar: MatSnackBar) {
    this.hide1 = this.hide2 = this.hide3 = true;
    this.audioVolumeValue = 100;
    this.deviceNameModel = '';
  }

  ngOnInit() {
  }

  saveDeviceName(): void {
    const name = this.deviceNameModel;
    if (name.length <= 0 || !this.controlService.isConnected()) { return; }
    const signature = 'set-device-name';
    const pkg = {
      action: signature,
      name: name
    };
    this.controlService.onMessage().subscribe((message: string) => {
      if (message === `[${signature}]OK`) {
        this.snackBar.open(
          'Device name changed successfully.',
          '', { duration: 1000 });
      } else {
        this.snackBar.open(
          'Error!',
          '', { duration: 1000 });
      }
      this.deviceNameModel = '';
    });
    this.controlService.send(JSON.stringify(pkg));
  }
}
