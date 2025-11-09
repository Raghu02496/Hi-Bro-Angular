import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private apiService : ApiService){

  }

  ngOnInit(){
    setInterval(()=>{
      this.apiService.status({}).subscribe();
    }, 14 * 60 * 1000)
    this.apiService.connectSocket.next();
  }
}
