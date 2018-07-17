import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../../models/event';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://192.168.100.2:4820';

@Injectable({
  providedIn: 'root'
})
export class ControlService {
  private socket: any;
  private connected = false;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
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
}
