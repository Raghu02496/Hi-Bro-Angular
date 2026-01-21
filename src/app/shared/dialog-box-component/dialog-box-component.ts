import { Component, output } from '@angular/core';
import { DialogData } from '../../models/dialog.model';

@Component({
  selector: 'app-dialog-box-component',
  imports: [],
  templateUrl: './dialog-box-component.html',
  styleUrl: './dialog-box-component.scss'
})
export class DialogBoxComponent {
  data!: DialogData;
  close = output<boolean>();
}
