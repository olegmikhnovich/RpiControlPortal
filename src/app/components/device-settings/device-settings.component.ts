import { OnInit, Component } from '@angular/core';
import { ControlService } from '../../services/control/control.service';
import { MatSnackBar } from '@angular/material';
import { Event } from '../../models/event';

export class DeviceInfo {
  name: string;
  model: string;
  os: string;
  temp: string;

  constructor() {
    this.name = this.model = '';
    this.os = this.temp = '';
  }
}

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.component.html',
  styleUrls: ['./device-settings.component.css']
})
export class DeviceSettingsComponent implements OnInit {
  hide1: boolean;
  hide2: boolean;
  hide3: boolean;
  pwd1Model: string;
  pwd2Model: string;
  pwd3Model: string;
  audioVolumeValue: number;
  newDeviceNameModel: string;
  pictureSrc: string;
  deviceInfo: DeviceInfo;

  constructor(private controlService: ControlService,
              private snackBar: MatSnackBar) {
    this.hide1 = this.hide2 = this.hide3 = true;
    this.audioVolumeValue = 100;
    this.newDeviceNameModel = '';
    this.deviceInfo = new DeviceInfo();
  }

  ngOnInit() {
    if (!this.controlService.isConnected()) {
      this.controlService.onEvent(Event.CONNECT).subscribe(() => this.loadData());
    } else {
      this.loadData();
    }
    this.controlService.onMessage().subscribe((message: string) => this.processMessage(message));
  }

  loadData(): void {
    this.getDeviceInfo();
    this.getDeviceVolume();
  }

  processMessage(message: string): void {
    if (message.length === 0 || message === undefined) { return; }
    const action = message.split('\n')[0];
    const signature = action.split(']')[0].substring(1);
    const status = action.split(']')[1];

    const sdn = 'set-device-name';
    const upp = 'update-portal-pwd';
    const ssv = 'set-sound-volume';
    const gsv = 'get-sound-volume';
    const gdi = 'get-device-info';
    switch (signature) {
      case sdn:
        if (status === 'OK') {
          this.snackBar.open(
            'Device name changed successfully.',
            '', { duration: 1000 });
        } else {
          this.snackBar.open(
            'Error!',
            '', { duration: 1000 });
        }
        this.newDeviceNameModel = '';
        break;
      case upp:
        if (status === 'OK') {
          this.snackBar.open(
            'Password changed successfully.',
            '', { duration: 1000 });
        } else {
          this.snackBar.open(
            'Error!.',
            '', { duration: 1000 });
        }
        this.pwd1Model = this.pwd2Model = this.pwd3Model = '';
        break;
      case ssv:
        if (status !== 'OK') {
          this.snackBar.open(
            'Error!',
            '', { duration: 1000 });
        }
        break;
      case gsv:
        this.audioVolumeValue = +message.split('\n')[1];
        break;
      case gdi:
        const rootImgFolder = '../../../assets/';
        const m = message.split('\n');
        if (m[0] === `[${signature}]OK`) {
          this.deviceInfo.name = m[1];
          this.deviceInfo.model = m[2];
          this.deviceInfo.os = m[3];
          this.deviceInfo.temp = m[4];
          this.pictureSrc = rootImgFolder + this.getPictureByModel(this.deviceInfo.model);
        }
        break;
    }
  }

  getPictureByModel(models: string): string {
    const m = models.toLowerCase().split(' ');
    let result = 'rpi3.jpg';
    if (m[0] === 'raspberry' && m[1] === 'pi') {
      switch (m[2]) {
        case '3':
          if (models.includes('plus')) {
            result = 'rpi3plus.jpg';
          } else {
            result = 'rpi3.jpg';
          }
          break;
        case '2':
          result = 'rpi2.jpg';
          break;
        case '1':
          if (m[4] === 'b') {
            result = 'rpi1bplus.jpg';
          } else {
            result = 'rpi1aplus.jpg';
          }
          break;
        case 'zero':
          if (m.length > 4 && m[3] === 'w') {
            result = 'rpizw.jpg';
          } else {
            result = 'rpiz.jpg';
          }
          break;
      }
    }
    return result;
  }

  saveDeviceName(): void {
    const name = this.newDeviceNameModel;
    if (name.length <= 0 || !this.controlService.isConnected()) { return; }
    const signature = 'set-device-name';
    const pkg = {
      action: signature,
      name: name
    };
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
    this.controlService.send(JSON.stringify(pkg));
  }

  setDeviceVolume(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'set-sound-volume';
    const pkg = {
      action: signature,
      value: this.audioVolumeValue
    };
    this.controlService.send(JSON.stringify(pkg));
  }

  getDeviceVolume(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'get-sound-volume';
    const pkg = {
      action: signature
    };
    this.controlService.send(JSON.stringify(pkg));
  }

  getDeviceInfo(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'get-device-info';
    const pkg = {
      action: signature
    };
    this.controlService.send(JSON.stringify(pkg));
  }
}
