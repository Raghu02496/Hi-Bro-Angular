import { ApplicationRef, createComponent, EnvironmentInjector, Injectable } from '@angular/core';
import { DialogBoxComponent } from '../../shared/dialog-box-component/dialog-box-component';
import { DialogData } from '../../models/dialog.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private evironMentInjector: EnvironmentInjector,
    private appRef: ApplicationRef,
  ) {}

  openDialog(data: DialogData) {
    const ref = createComponent(DialogBoxComponent, {
      environmentInjector: this.evironMentInjector,
    });

    ref.instance.data = data;
    this.appRef.attachView(ref.hostView);
    document.body.appendChild(ref.location.nativeElement);

    ref.instance.close.subscribe((val) => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
    });
    return ref.instance.close;
  }
}
