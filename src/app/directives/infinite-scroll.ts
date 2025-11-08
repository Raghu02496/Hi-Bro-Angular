import { Directive, ElementRef, output } from '@angular/core';

@Directive({
  selector: '[InfiniteScroll]'
})
export class InfiniteScroll {
  intersected = output<void>();
  observer !: IntersectionObserver;
  target !: ElementRef<HTMLElement>
  constructor(
    eleRef : ElementRef<HTMLElement>
  ) 
  {
    this.target = eleRef
  }

  ngAfterViewInit(){
    this.observer = new IntersectionObserver((entries)=>{
      for(let entry of entries){
        if(entry.isIntersecting){
          this.observer.disconnect();
          this.intersected.emit();
        }
      }
    },
    {
      root : null,
      rootMargin : '0px',
      threshold : 0
    })

    this.observer.observe(this.target.nativeElement);
  }

  ngOnDestroy(){
    this.observer.disconnect();
  }

}
