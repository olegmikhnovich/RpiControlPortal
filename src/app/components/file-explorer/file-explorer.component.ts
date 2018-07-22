import { Component, OnInit } from '@angular/core';
import {ControlService} from '../../services/control/control.service';
import {Event} from '../../models/event';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {
  folders: string[] = [];
  homeDir = '/home/pi';
  currentDir: string;

  constructor(private controlService: ControlService) {
    this.currentDir = this.homeDir;
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
    this.getDirectory('home');
  }

  openItem(item: string): void {
    if (!item.includes('.')) {
      this.currentDir += '/' + item;
      this.getDirectory(this.currentDir);
    } else {
      const url = this.controlService.getServerUrl() + '/get-file?path=' + (this.currentDir + '/' + item );
      window.open(url, 'file');
    }
  }

  goBack(): void {
    let d = this.currentDir.split('/');
    d = d.slice(0, d.length - 1);
    this.currentDir = d.join('/');
    this.getDirectory(this.currentDir);
  }

  goHome(): void {
    this.currentDir = this.homeDir;
    this.getDirectory(this.homeDir);
  }

  refresh(): void {
    this.getDirectory(this.currentDir);
  }

  processMessage(message: string): void {
    if (message.length === 0 || message === undefined) { return; }
    const action = message.split('\n')[0];
    const signature = action.split(']')[0].substring(1);
    const status = action.split(']')[1];

    const gd = 'get-dir';
    switch (signature) {
      case gd:
        if (status === 'OK') {
          this.folders = message.split('\n')[1].split(',');
          if (this.folders.length === 1 && this.folders[0].length === 0) {
            this.folders = [];
          }
        } else {
          this.folders = [];
        }
        break;
    }
  }

  getDirectory(path: string): void {
    if (!this.controlService.isConnected()) { return; }
    const signature = 'get-dir';
    const pkg = {
      action: signature,
      path: path
    };
    this.controlService.send(JSON.stringify(pkg));
  }
}
