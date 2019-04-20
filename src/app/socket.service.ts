import { Injectable } from '@angular/core';

//importing socket io
import * as io from 'socket.io-client';
import { Observable, throwError } from 'rxjs';

//for http requests
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = "http://api.appdevtest.xyz";

  private socket;

  constructor(public http: HttpClient) {
    //first step where connection is established. i.e. Handshake moment
    this.socket = io(this.url);
  }

  //events to be listened

  public authError = () => {
    return Observable.create((observer) => {

      this.socket.on('auth-error', (data) => {

        observer.next(data);

      })//end socket

    });//end observer

  }//end authError

  public verifyUser = () => {

    return Observable.create((observer) => {
 
      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      });//end socket

    });//end return of Observable

  }//end verifyUser

  public setUser = (authToken) => {
    

    this.socket.emit("set-user", authToken);

  }//end setUser 

  //-------------------------------------------------------

  public getNotifications = () => {
    return Observable.create((observer) => {
      this.socket.on('notification', (data) => {        
        observer.next(data);
        
      });
    });
  }

  //emit: to create an new ChatRoom
  public createChatRoom = (data) => {
    this.socket.emit('createChatRoom', data)
  }

  //listen: that a new ChatRoom has been cretaed and saved
  public chatRoomCreated = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }

  //display chat rooms list in main room, while also updating the list
  public getNewlyCreatedChatRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('chatRoomCreatedGlobal', (data) => {
        observer.next(data);
      });
    });
  }

  //doubtful
  public updateMainRoomOnLeave = () => {
    return Observable.create((observer) => {
      this.socket.on('chatRoomMemberLeftGlobal', (data) => {
        observer.next(data);
      });
    });
  }

  ////update/refresh the main room after any updates in any chat room 
  public updateMainRoomOnEdit = () => {
    return Observable.create((observer) => {
      this.socket.on('chatRoomEditedGlobal', (data) => {
        observer.next(data);
      });
    });
  }

  public updateMainRoomOnDelete = () => {
    return Observable.create((observer) => {
      this.socket.on('chatRoomDeletedGlobal', (data) => {
        observer.next(data);
      });
    });
  }

  public sendGlobalMessage = (chatMsgObject) => {
    this.socket.emit('chatMsgGlobal', chatMsgObject);
  }

  // main chat window
  public startRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('startChatRoom', (data) => {
        observer.next(data);
      });
    });
  }
  public emitJoinRoom = (data) => {
    this.socket.emit('joinChatRoom', data)
  }

  public addChatRoomMember = () => {
    return Observable.create((observer) => {
      this.socket.on('addChatRoomMember', (data) => {
        observer.next(data);
      });
    });
  }

  public onlineUsers = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (data) => {
        observer.next(data);
      });
    });
  }
  

  //for any type of update in a chat room like edit name, change status, delete etc.
  public listenChatRoomUpdates = () => {
    return Observable.create((observer) => {
      this.socket.on('chatRoomEdited', (data) => {
        observer.next(data);
      });
    });
  }

  public editChatRoom = (data) => {
    this.socket.emit('editChatRoom', data)
  }

  public leaveChatRoom = (data) => {
    this.socket.emit('leaveChatRoom', data)
  }

  public onChatRoomLeft = () => {
    return Observable.create((observer) => {
      this.socket.on('chatRoomMemberLeft', (data) => {
        observer.next(data);
      });
    });
  }

  public changeChatRoomStatus = (data) => {
    this.socket.emit('chatRoomStatus', data)
  }

  public deleteChatRoom = (roomId) => {
    this.socket.emit('deleteChatRoom', roomId)
  }

  //go back to main room after a chat room is deleted
  public backToMainRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('redirOnDelete', (data) => {
        observer.next(data);
      });
    });
  }

  public sendMsgInChatRoom = (chatMsgObject) => {
    this.socket.emit('chatRoomMsg', chatMsgObject);
  }

  public receiveRoomMessage = () => {
    return Observable.create((observer) => {
      this.socket.on('messageReceivedInChatRoom', (data) => {
        observer.next(data);
      });
    });
  }

  public emitTyping = (user) => {
    this.socket.emit('typing', user)
  }
  public onTyping = () => {
    return Observable.create((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
    });
  }

  public disconnect = () => {
    this.socket.disconnect()
  }

}