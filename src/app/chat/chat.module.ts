import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; 
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from '@ngx-toolkit/cookie';
import { RemoveSpecialCharPipe } from '../shared/pipe/remove-special-char.pipe';
import { SharedModule } from '../shared/shared.module';
import { ChatRouteGuardService } from './chat-route-guard.service';
import { MainChatWindowComponent } from './main-chat-window/main-chat-window.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CookieModule.forRoot(),
    RouterModule.forChild([
      { path: 'chatRoom', component: ChatBoxComponent, canActivate:[ChatRouteGuardService] },
      { path:'mainChatWindow/:chatRoomId',component:MainChatWindowComponent}
    ]),
    SharedModule
  ],
  
  declarations: [ChatBoxComponent, RemoveSpecialCharPipe, MainChatWindowComponent],
  providers:[ChatRouteGuardService]
})
export class ChatModule { }
