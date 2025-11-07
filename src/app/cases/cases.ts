import { Component } from '@angular/core';
import { ApiService } from '../api-service';
import { Router } from "@angular/router";

@Component({
  selector: 'cases',
  imports: [],
  templateUrl: './cases.html',
  styleUrl: './cases.scss'
})
export class Cases {
  cases : Array<any> = [];
  constructor(
    private apiService : ApiService,
    private router : Router
  ){}

  ngOnInit(){
    let request = {
      page_no : 1
    }

    this.apiService.listCases(request).subscribe({
      next : (res:any)=>{
        if(res.ok){
          this.cases.push(...res.data);
        }
      }
    })
  }

  navigateToCase(case_id:string){
    this.router.navigate([`/case/${case_id}`])
  }
}
