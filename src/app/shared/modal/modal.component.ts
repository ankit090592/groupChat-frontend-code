import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  //unique id of modal to open the specific modal
  @Input() id
  @Input() modalTitle
  @Input() buttonTitle
  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>()

  constructor() { }

  ngOnInit() {
  }

  public notifyEvent: any = () => {
    this.notify.emit()
  }


}
