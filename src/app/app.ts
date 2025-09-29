import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { todo } from './todo.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Hi-Bro-Angular');
  todoArr : Array<todo> = [];
  todoFormGrp !: FormGroup
  constructor(
    private apiService:ApiService,
    private fb : FormBuilder
  ){
    this.todoFormGrp = fb.group({
      string : ['',Validators.required],
      done : [false]
    })
  }

  ngOnInit(){
    this.fetchTodo()
  }

  fetchTodo(){
    let request = {
      limit : 10,
      page : 0
    }
    
    this.apiService.getTodo(request).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.todoArr.push(...res.data)
        }
      }
    })
  }

  addTodo(){
    if(this.todoFormGrp.valid){
      let request = {
        string :this.todoFormGrp.get('string')?.value,
        done : this.todoFormGrp.get('done')?.value
      }

      this.apiService.addTodo(request).subscribe({
        next : (res:any)=>{
          if(res.ok){
            this.todoFormGrp.reset()
          }
        }
      })
    }
  }

}
