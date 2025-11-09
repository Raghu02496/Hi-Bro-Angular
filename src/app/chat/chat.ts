import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api-service';
import { whiteSpaceValidator } from '../validators/validators';

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
 
  constructor(private apiService : ApiService,private fb : FormBuilder){
    this.messageFormGrp = fb.group({
      message: ['', [Validators.required,whiteSpaceValidator()]],
    })
  }

  ngOnInit(){
    this.apiService.recieveMessage().subscribe({
      next : (message)=>{
        if(this.selectedUser){
          this.messagesArr.push(message)
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
      this.apiService.testSocket({toUserId : this.selectedUser._id, message : message});

      this.messageFormGrp.reset({
        message: ''
      })
    }
  }

}
