import { Component, OnInit } from '@angular/core';
import { ControlService } from '../../services/control/control.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
  terminalData: string;
  terminalProcessStatus: number;
  command: string;

  constructor(private controlService: ControlService) {
    this.terminalData = this.command = '';
    this.terminalProcessStatus = -777;
  }

  ngOnInit() {
    this.controlService.onMessage().subscribe((message: string) => this.processMessage(message));
  }

  sendCommand() {
    if (!this.controlService.isConnected() || this.command.length === 0) { return; }
    if (this.command === 'clear') {
      this.terminalData = this.command = '';
      this.terminalProcessStatus = -777;
      return;
    }
    const signature = 'send-term-cmd';
    const pkg = {
      action: signature,
      command: this.command
    };
    this.controlService.send(JSON.stringify(pkg));
    this.command = '';
  }

  processMessage(message: string): void {
    if (message.length === 0 || message === undefined) { return; }
    const action = message.split('\n')[0];
    const signature = action.split(']')[0].substring(1);
    const status = action.split(']')[1];

    const gd = 'send-term-cmd';
    const tr = 'term-resp';

    switch (signature) {
      case gd:
        if (status !== 'OK') {
          console.error(`[${signature}] -> Error!`);
        }
        break;
      case tr:
        const msg = message.slice(action.length);
        if (status === 'OUT') {
          this.terminalData += msg;
        } else if (status === 'ERR') {
          this.terminalData += msg;
        } else if (status === 'CLOSE') {
          this.terminalProcessStatus = +msg;
        }
        break;
    }
  }

}
