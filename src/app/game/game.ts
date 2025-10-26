import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api-service';
import { conversation, caseDetails, suspect } from '../detective.interface';

@Component({
  selector: 'game',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {
  interrogateFormGrp !: FormGroup
  conversationArr: Array<conversation> = [];
  caseDetails !: caseDetails
  interrogatingSuspect !: suspect
  loadingResult: boolean = false
  @ViewChild('responseBox',{read : ElementRef}) responseBox !: ElementRef<HTMLDivElement>
  page_no = 0;
  loadMore = false
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.interrogateFormGrp = fb.group({
      content: ['', Validators.required],
    })
  }

  ngOnInit(){
    this.fetchCaseDetails();
  }

  getConversation(){
    this.page_no = 1;
    this.conversationArr = [];
    let request = {
      case_id : '68f8bb412f45862f36939609',
      suspect_id : this.interrogatingSuspect._id,
      page_no : this.page_no
    }
    this.apiService.getConversation(request).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.loadMore = res.data.length === 20
          this.conversationArr.push(...res.data)
          this.scrollToBottomOfResponseBox()
        }
      }
    })
  }

  getOldMessages(){
    if(this.loadMore){
      this.page_no ++;
      let request = {
        case_id : '68f8bb412f45862f36939609',
        suspect_id : this.interrogatingSuspect._id,
        page_no : this.page_no
      }
  
      this.apiService.getConversation(request).subscribe({
        next : (res:any)=>{
          if(res.ok){
            this.loadMore = res.data.length === 20
            this.conversationArr.unshift(...res.data)
          }
        }
      })
    }
  }

  msgChatGpt() {
    if (this.interrogateFormGrp.valid && this.interrogatingSuspect && !this.loadingResult) {
      let content = this.interrogateFormGrp.get('content')?.value.trim()
      let request = {
        case_id : '68f8bb412f45862f36939609',
        suspect : this.interrogatingSuspect,
        content: content,
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

  fetchCaseDetails(){
    let request = {
      case_id : "68f8bb412f45862f36939609"
    }
    this.apiService.getCaseById(request).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.caseDetails = res.data
        }
      }
    })
  }
}
