import {Component, OnInit} from '@angular/core';
import {Event} from '../../models/event';
import {ControlService} from '../../services/control/control.service';
import {BleDevice} from '../../models/bledevice';
import {MatSnackBar} from '@angular/material';

export class EthConnection {
  name: string;
  ip: string;
  mac: string;

  constructor(name: string, ip: string, mac: string) {
    this.name = name;
    this.ip = ip;
    this.mac = mac;
  }
}

@Component({
  selector: 'app-connectivity',
  templateUrl: './connectivity.component.html',
  styleUrls: ['./connectivity.component.css']
})
export class ConnectivityComponent implements OnInit {
  ethConn: EthConnection;
  bleChecked: boolean;
  bleDisabled: boolean;
  bleDevices: BleDevice[] = [];
  blePairedDevices: BleDevice[] = [];

  constructor(private controlService: ControlService,
              private snackBar: MatSnackBar) {
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
    this.getEthConnection();
  }

  processMessage(message: string): void {
    if (message.length === 0 || message === undefined) {
      return;
    }
    const action = message.split('\n')[0];
    const signature = action.split(']')[0].substring(1);
    const status = action.split(']')[1];

    const gen = 'get-eth-conn';
    const ble = 'ble-process';

    switch (signature) {
      case gen:
        if (status === 'OK') {
          const v = JSON.parse(message.split('\n')[1]);
          this.ethConn = new EthConnection(v['name'], v['ip'], v['mac']);
        }
        break;
      case ble:
        if ((status === 'OUT') && (this.bleChecked)) {
          const jsonPkg = JSON.parse(message.split('\n')[1]);
          const device = new BleDevice(jsonPkg['data']);
          const cm = jsonPkg['command'].toString();
          if (!this.bleDevices.find(value => value.mac === device.mac) || !cm.includes('scan')) {
            if (cm.includes('scan')) {
              this.bleDevices.push(device);
            } else {
              this.blePairedDevices.push(device);
              this.bleDevices.splice(
                this.bleDevices.findIndex(value => value.mac === device.mac), 1);
            }
          }
        }
        break;
    }
  }

  getEthConnection(): void {
    if (!this.controlService.isConnected()) {
      return;
    }
    const signature = 'get-eth-conn';
    const pkg = {
      action: signature
    };
    this.controlService.send(JSON.stringify(pkg));
  }

  toggleSlideBle(check?: boolean): void {
    if (!this.controlService.isConnected()) {
      return;
    }
    const state = (check !== undefined) ? check : this.bleChecked;
    const signature = 'ble-process';
    let pkg = null;
    pkg = {
      action: signature,
      command: `scan ${(state) ? 'on' : 'off'}\n`
    };
    this.controlService.send(JSON.stringify(pkg));
    if (state) {
      setTimeout(() => {
        pkg = {
          action: signature,
          command: `paired-devices\n`
        };
        this.controlService.send(JSON.stringify(pkg));
      }, 2000);
    } else {
      pkg = {
        action: signature,
        command: `quit\n`
      };
      this.bleDevices = [];
      this.blePairedDevices = [];
    }
    if (pkg) {
      this.controlService.send(JSON.stringify(pkg));
    }
  }

  connectBleDevice(device: BleDevice) {
    if (!this.controlService.isConnected()) {
      return;
    }
    this.snackBar.open(
      `Attempt to pairing to ${device.name}`,
      '', {duration: 3000});
    const signature = 'ble-process';
    const pkg = {
      action: signature,
      command: `connect ${device.mac}\n`
    };
    this.controlService.send(JSON.stringify(pkg));
    this.updateBleUI();
  }

  removeBleDevice(device: BleDevice) {
    if (!this.controlService.isConnected()) {
      return;
    }
    this.snackBar.open(
      `Removing pair with ${device.name}`,
      '', {duration: 2000});
    const signature = 'ble-process';
    const pkg = {
      action: signature,
      command: `remove ${device.mac}\n`
    };
    this.controlService.send(JSON.stringify(pkg));
    this.blePairedDevices.splice(
      this.blePairedDevices.findIndex(value => value.mac === device.mac), 1);
    this.updateBleUI();
  }

  updateBleUI() {
    setTimeout(() => {
      this.toggleSlideBle(false);
      this.toggleSlideBle(true);
    }, 5000);
  }
}
