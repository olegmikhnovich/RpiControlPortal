import {OnInit, Component} from '@angular/core';
import { ControlService } from '../../services/control/control.service';
import { MatSnackBar } from '@angular/material';
import { Event } from '../../models/event';

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
  pwd1Model: string;
  pwd2Model: string;
  pwd3Model: string;

  constructor(private controlService: ControlService,
              private snackBar: MatSnackBar) {
    this.hide1 = this.hide2 = this.hide3 = true;
    this.audioVolumeValue = 100;
    this.deviceNameModel = '';
  }

  ngOnInit() {
    this.syncDeviceModule();
  }

  syncDeviceModule(): void {
    if (!this.controlService.isConnected()) {
      const scope = this;
      this.controlService.onEvent(Event.CONNECT).subscribe(() => {
        scope.getDeviceVolume();
      });
    } else {
      this.getDeviceVolume();
    }
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

  updatePassword(): void {
    if (this.pwd1Model.length === 0 || this.pwd2Model.length === 0 || this.pwd3Model.length === 0) { return; }
    if (!this.controlService.isConnected()) { return; }
    if (this.pwd2Model !== this.pwd3Model) {
      this.snackBar.open(
        'Error! Passwords do not match.',
        '', { duration: 1000 });
      return;
    }
    const signature = 'update-portal-pwd';
    const pkg = {
      action: signature,
      old: this.pwd1Model,
      new: this.pwd2Model
    };
    this.controlService.onMessage().subscribe((message: string) => {
      if (message === `[${signature}]OK`) {
        this.snackBar.open(
          'Password changed successfully.',
          '', { duration: 1000 });
      } else {
        this.snackBar.open(
          'Error!.',
          '', { duration: 1000 });
      }
      this.pwd1Model = this.pwd2Model = this.pwd3Model = '';
    });
    this.controlService.send(JSON.stringify(pkg));
  }

  setDeviceVolume(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'set-sound-volume';
    const value = this.audioVolumeValue;
    const pkg = {
      action: signature,
      value: value
    };
    this.controlService.onMessage().subscribe((message: string) => {
      this.audioVolumeValue = value;
      if (message !== `[${signature}]OK`) {
        this.snackBar.open(
          'Error!',
          '', { duration: 1000 });
      }
    });
    this.controlService.send(JSON.stringify(pkg));
  }

  getDeviceVolume(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'get-sound-volume';
    const pkg = {
      action: signature
    };
    const scope = this;
    this.controlService.onMessage().subscribe((message: string) => {
      if (message != null || message !== undefined) {
        scope.audioVolumeValue = +message;
      }
    });
    this.controlService.send(JSON.stringify(pkg));
  }
}
