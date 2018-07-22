import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../../models/event';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ControlService {
  private SERVER_URL = ControlService.setServerUrl();
  private socket: any;
  private connected = false;

  static setServerUrl(): string {
    const l = window.location.href;
    const ip = l.split('://')[1].split('/')[0].split(':')[0];
    return `http://${ip}:4820`;
  }

  public initSocket(): void {
    this.socket = socketIo(this.SERVER_URL);
    this.socket.connect();
    this.onEvent(Event.CONNECT).subscribe(() => {
      this.connected = true;
    });

    this.onEvent(Event.DISCONNECT).subscribe(() => {
      this.connected = false;
    });
  }

  public send(message: string): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('message', (data: string) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public getServerUrl(): string {
    return this.SERVER_URL;
  }
}
