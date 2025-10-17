import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { todo } from './todo.interface';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    Header
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Hi-Bro-Angular');
  todoArr: Array<todo> = [];
  interrogateFormGrp !: FormGroup
  conversationArr: Array<any> = [];
  loadingResult: boolean = false
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.interrogateFormGrp = fb.group({
      query: ['', Validators.required],
    })
  }

  msgChatGpt() {
    if (this.interrogateFormGrp.valid && !this.loadingResult) {
      let query = this.interrogateFormGrp.get('query')?.value.trim()
      let request = {
        query: query
      }
      this.conversationArr.push({ from: 'user', query: query })
      this.loadingResult = true
      this.apiService.sendMessage(request).subscribe({
        next: (res: any) => {
          if (res.ok) {
            this.conversationArr.push({ from: 'gpt', query: res.data })
          }
          this.loadingResult = false
        }
      })
      this.interrogateFormGrp.reset({
        query: ''
      })
    }
  }
}
