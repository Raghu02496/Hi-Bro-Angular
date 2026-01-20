import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/services/api-service';
import { whiteSpaceValidator } from '../core/validators/validators';

@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat {
  messagesArr : Array<any> = []
  users : Array<any> = [];
  messageFormGrp !: FormGroup;
  selectedUser  : any
  @ViewChild('chatBox',{read : ElementRef}) chatBox !: ElementRef<HTMLDivElement>

  constructor(private apiService : ApiService,private fb : FormBuilder){
    this.messageFormGrp = fb.group({
      message: ['', [Validators.required,whiteSpaceValidator()]],
    })

    this.apiService.connectSocket.next();
  }

  ngOnInit(){
    this.apiService.recieveMessage().subscribe({
      next : (data:any)=>{
        if(this.selectedUser._id === data.fromUserId){
          this.messagesArr.push(data.message)
          this.scrollToBottom();
        }
      }
    })

    this.apiService.listUsers({}).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.users.push(...res.data)
        }
      }
    })

  }

  sendMessage(event : Event){
    event.preventDefault();
    if(this.messageFormGrp.valid && this.selectedUser){
      const message = this.messageFormGrp.get('message')?.value.trim()
      this.messagesArr.push(message)
      this.apiService.sendSocket({toUserId : this.selectedUser._id, message : message});
      this.scrollToBottom();
      this.messageFormGrp.reset({
        message: ''
      })
    }
  }

  scrollToBottom(){
    setTimeout(() => {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight
    }, 50);
  }

  ngOnDestroy(){
    this.apiService.socket.disconnect();
  }

}
