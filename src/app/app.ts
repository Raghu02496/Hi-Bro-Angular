import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('responseBox',{read : ElementRef}) responseBox !: ElementRef<HTMLDivElement>
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.interrogateFormGrp = fb.group({
      content: ['', Validators.required],
    })
  }

  ngOnInit(){
    let request = {
      case_id : 'case01',
    }
    this.apiService.getConversation(request).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.conversationArr.push(...res.data)
          this.scrollToBottomOfResponseBox()
        }
      }
    })
  }

  msgChatGpt() {
    if (this.interrogateFormGrp.valid && !this.loadingResult) {
      let content = this.interrogateFormGrp.get('content')?.value.trim()
      let request = {
        case_id : 'case01',
        content: content
      }
      this.conversationArr.push({ role: 'user', content: content })
      this.scrollToBottomOfResponseBox()
      this.loadingResult = true
      this.apiService.sendMessage(request).subscribe({
        next: (res: any) => {
          if (res.ok) {
            this.conversationArr.push({ role: 'assistant', content: res.data })
            this.scrollToBottomOfResponseBox()
          }
          this.loadingResult = false
        }
      })
      this.interrogateFormGrp.reset({
        content: ''
      })
    }
  }

  scrollToBottomOfResponseBox(){
    // To wait for browser to render the element
    setTimeout(()=>{
      this.responseBox.nativeElement.scrollTop = this.responseBox.nativeElement.scrollHeight
    },50)
  }
}
