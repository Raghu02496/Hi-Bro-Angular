import { inject, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  connectSocket: Subject<void> = new Subject();
  socket!: Socket;
  messageObservable$!: Observable<string>;
  private authService = inject(AuthService);

  constructor() {
    this.connectWebSocket();
  }

  connectWebSocket() {
    this.connectSocket.subscribe({
      next: () => {
        if (this.authService.isLoggedIn()) {
          this.socket = io(environment.apiUrl, {
            withCredentials: true,
            auth: {
              accessToken: this.authService.getAccessToken(),
            },
          });

          this.messageObservable$ = new Observable((subscriber) => {
            this.socket.on('sendMessage', (msg) => {
              subscriber.next(msg);
            });
          });
        }
      },
    });
  }

  recieveMessage() {
    return this.messageObservable$;
  }

  sendSocket(payload: any) {
    this.socket.emit('sendMessage', payload);
  }
}
