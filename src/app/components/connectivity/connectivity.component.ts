import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { ControlService } from '../../services/control/control.service';

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

  constructor(private controlService: ControlService) {
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
    if (message.length === 0 || message === undefined) { return; }
    const action = message.split('\n')[0];
    const signature = action.split(']')[0].substring(1);
    const status = action.split(']')[1];

    const gen = 'get-eth-conn';
    switch (signature) {
      case gen:
        if (status === 'OK') {
          const v = JSON.parse(message.split('\n')[1]);
          this.ethConn = new EthConnection(v['name'], v['ip'], v['mac']);
        }
        break;
    }
  }

  getEthConnection(): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'get-eth-conn';
    const pkg = {
      action: signature
    };
    this.controlService.send(JSON.stringify(pkg));
  }
}
