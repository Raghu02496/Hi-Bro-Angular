import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api-service';
import { conversation, caseDetails, suspect } from '../detective.interface';
import { InfiniteScroll } from '../directives/infinite-scroll';
import { ActivatedRoute } from '@angular/router';
import { whiteSpaceValidator } from '../validators/validators';

@Component({
  selector: 'game',
  imports: [
    ReactiveFormsModule,
    InfiniteScroll
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
  prevScrollTop = 0;
  prevScrollHeight = 0;
  page_no = 0;
  loadMore = false
  case_id = ""
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private activatedRoute : ActivatedRoute
  ) {
    this.interrogateFormGrp = fb.group({
      content: ['', [Validators.required,whiteSpaceValidator()]],
    })

    this.case_id = activatedRoute.snapshot.paramMap.get('id') as string
  }

  ngOnInit(){
    this.fetchCaseDetails();
  }

  getConversation(){
    this.page_no = 1;
    this.conversationArr = [];
    let request = {
      case_id : this.caseDetails._id,
      suspect_id : this.interrogatingSuspect._id,
      page_no : this.page_no
    }
    this.apiService.getConversation(request).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.loadMore = res.data.length === 20
          this.conversationArr.push(...res.data)
          this.observeResponseBoxMutations(true);
        }
      }
    })
  }

  getOldMessages(){
    if(this.loadMore){

      this.observeResponseBoxMutations();
      this.page_no ++;
      let request = {
        case_id : this.caseDetails._id,
        suspect_id : this.interrogatingSuspect._id,
        page_no : this.page_no
      }
  
      this.apiService.getConversation(request).subscribe({
        next : (res:any)=>{
          if(res.ok){
            this.prevScrollTop = this.responseBox.nativeElement.scrollTop;
            this.prevScrollHeight = this.responseBox.nativeElement.scrollHeight;
            this.loadMore = res.data.length === 20
            this.conversationArr.unshift(...res.data)
          }
        }
      })
    }
  }

  msgChatGpt(event : Event) {
    event.preventDefault();
    if(!this.interrogatingSuspect){
      alert("Choose suspect first 🤦")
      return
    }

    if (this.interrogateFormGrp.valid && !this.loadingResult) {
      let content = this.interrogateFormGrp.get('content')?.value.trim()
      let request = {
        case_id : this.caseDetails._id,
        suspect : this.interrogatingSuspect,
        content: content,
      }
      this.conversationArr.push({_id : '', role: 'user', content: content })
      this.observeResponseBoxMutations(true);
      this.loadingResult = true
      this.apiService.sendMessage(request).subscribe({
        next: (res: any) => {
          if (res.ok) {
            const insertedIds = res.data.insertedIds;
            this.conversationArr[this.conversationArr.length-1]._id = insertedIds[0];
            this.conversationArr.push({_id : insertedIds[1], role: 'assistant', content: res.data.reply });
            this.observeResponseBoxMutations(true);
          }
          this.loadingResult = false
        }
      })
      this.interrogateFormGrp.reset({
        content: ''
      })
    }
  }

  fetchCaseDetails(){
    let request = {
      case_id : this.case_id
    }
    this.apiService.getCaseById(request).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.caseDetails = res.data
        }
      }
    })
  }

  observeResponseBoxMutations(bottomScroll = false){
    const observer = new MutationObserver(()=>{
      if(bottomScroll){
        this.responseBox.nativeElement.scrollTop = this.responseBox.nativeElement.scrollHeight
      }else{
        const newScrollHeight = this.responseBox.nativeElement.scrollHeight;
        const delta = newScrollHeight - this.prevScrollHeight;
        this.responseBox.nativeElement.scrollTop = this.prevScrollTop + delta;
      }
      observer.disconnect();
    })

    observer.observe(this.responseBox.nativeElement,{ childList: true, subtree: true });
  }
}
