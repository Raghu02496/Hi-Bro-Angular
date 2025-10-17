import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { conversation } from './detective.interface';
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
  interrogateFormGrp !: FormGroup
  conversationArr: Array<conversation> = [];
  loadingResult: boolean = false
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.interrogateFormGrp = fb.group({
      content: ['', Validators.required],
    })
  }

  msgChatGpt() {
    if (this.interrogateFormGrp.valid && !this.loadingResult) {
      let content = this.interrogateFormGrp.get('content')?.value.trim()
      let request = {
        content: content
      }
      this.conversationArr.push({ role: 'user', content: content })
      this.loadingResult = true
      this.apiService.sendMessage(request).subscribe({
        next: (res: any) => {
          if (res.ok) {
            this.conversationArr.push({ role: 'assistant', content: res.data })
          }
          this.loadingResult = false
        }
      })
      this.interrogateFormGrp.reset({
        content: ''
      })
    }
  }
}
