import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api-service';
import { share, shareReplay } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Hi-Bro-Angular');
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
    
    this.apiService.getTodo(request).pipe(shareReplay(1)).subscribe({
      next : (res)=>{
        console.log(res,'api status')
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
