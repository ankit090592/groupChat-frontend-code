import { Injectable } from '@angular/core';

//importing http client to make requests
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { HttpErrorResponse, HttpParams } from '@angular/common/http'
// import { CookieService, Cookie } from '@ngx-toolkit/cookie';
import { Cookie } from 'ng2-cookies/ng2-cookies';
//Observable is like a medium of interaction between components & API 
// import { Observable } from "rxjs/Observable"
// import 'rxjs/add/operator/catch'
// import 'rxjs/add/operator/do'
// import 'rxjs/add/operator/toPromise'

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrlUsers = 'http://localhost:4900/api/v1/users';
  private baseUrlChatRoom = 'http://localhost:4900/api/v1/chatRoom';
  private baseUrlChatRoomMsgs = 'http://localhost:4900/api/v1/chatMessages';
  constructor(public http: HttpClient) { }

  //------------------------------ user functions -------------------------------------- 
  //getter function for getting any local user info if it is already saved
  //this function is used in user Module login.component.ts
  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  //setter function for setting any user info in local Storage for session management
  //this function is used in user Module login.component.ts
  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  //new way to send data parameters is using HttpParams() and sending it as 1 param
  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.baseUrlUsers}/signup`, params)
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.baseUrlUsers}/signin`, params)
  }


  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    let userdetails = this.getUserInfoFromLocalStorage();

    return this.http.post(`${this.baseUrlUsers}/logout/${userdetails.userId}`, params);

  } // end logout function
  //------------------------------ user functions end -------------------------------------- 

  public sendForgottenPwdFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email);
    return this.http.post(`${this.baseUrlUsers}/forgotPwd`, params);
  }//end sendForgottenPwdFunction function

  //----------------------------------- chat functions -------------------------------------- 
  public getAllChatRooms(): Observable<any> {
    return this.http.get(`${this.baseUrlChatRoom}/getAllChatRooms?authToken=${Cookie.get('authToken')}`)
  }

  public getSingleChatRoom(chatRoomId): Observable<any> {
    return this.http.get(`${this.baseUrlChatRoom}/getSingleChatRoom/${chatRoomId}?authToken=${Cookie.get('authToken')}`)
  }

  public getMyChatRooms(userId): Observable<any> {
    return this.http.get(`${this.baseUrlChatRoom}/getMyChatRooms/${userId}?authToken=${Cookie.get('authToken')}`)
  }  

  //to get all chat messages of a chatRoom
  public getChatRoomMessages(chatRoomId, pageValue): Observable<any> {
    return this.http.get(`${this.baseUrlChatRoomMsgs}/${chatRoomId}?skip=${pageValue}&authToken=${Cookie.get('authToken')}`)
  }
  
  
  public sendInvite(inviteEmail,chatRoomId): Observable<any> {

    const params = new HttpParams()
      .set('inviteEmail', inviteEmail)

    return this.http.post(`${this.baseUrlChatRoom}/sendInvite/${chatRoomId}`, params);
  }//end sendInvite  


  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error)
      errorMessage = 'An error occurred ${err.error.message}';
  }
}
