import { Component, EmbeddedViewRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-auth',
  imports: [RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
  @ViewChild('login',{read : TemplateRef}) loginTemplate !: TemplateRef<any>
  @ViewChild('templateContainer',{read : ViewContainerRef}) templateContainer !: TemplateRef<any>
  loginEmbeddedRef !: EmbeddedViewRef<any>

  ngAfterViewInit(){
    this.templateContainer.createEmbeddedView(this.loginTemplate);
  }
  
}
