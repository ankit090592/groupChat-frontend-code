import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FirstCharComponent } from './first-char/first-char.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UserDetailsComponent, FirstCharComponent, ModalComponent],
  exports: [
    CommonModule,
    FormsModule,
    UserDetailsComponent,
    FirstCharComponent,
    ModalComponent
  ]
})
export class SharedModule { }
