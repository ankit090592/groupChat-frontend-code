import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { chatRoom } from './chatRoom-interface';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})

export class ChatBoxComponent implements OnInit {
  public authToken: any;
  public userInfo: any;
  public userName: any;
  public chatRoomId: any;
  public chatRoomName: string;
  public allChatRooms: any = [];
  public myChatRooms: any = [];
  public chatRoomMember: boolean = false;
  public newJoinedRoomData: any;  
  public mainRoomData: any;
  public disconnectedSocket: boolean;
  public notifData: any;
  constructor(public AppService: AppService, public SocketService: SocketService, public router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.chatRoomId = 'chatRoomGlobal'
    this.authToken = Cookie.get("authToken")
    console.log("authToken in chat-box component: " + this.authToken)
    this.userName = Cookie.get("userName")
    this.verifyUserConfirmation()
    this.userInfo = this.AppService.getUserInfoFromLocalStorage()
    console.log("userInfo in chat-box component: " + JSON.stringify(this.userInfo))

    this.joinGlobalChatRoom()
    this.getMyChatRooms()
    this.getAllChatRooms()
    this.getMainRoomData()
    this.addToMainRoom()
    this.updateMainRoomOnEdit()
    this.updateMainRoomOnLeave()
    this.updateMainRoomOnDelete()
    this.authError()
  }

  public verifyUserConfirmation: any = () => {

    this.SocketService.verifyUser()
      .subscribe((data) => {

        this.disconnectedSocket = false;

        this.SocketService.setUser(this.authToken);

      });//end subscribe
  }//end verifyUserConfirmation

  //join the main room which is mandatory to join  
  public joinGlobalChatRoom: any = () => {
    console.log("in chat-box component: joined main room")
    let data = {
      chatRoomId: this.chatRoomId,
      userId: this.userInfo.userId,
      userName: this.userName
    }
    this.newJoinedRoomData = data;
    console.log(this.newJoinedRoomData);
    this.SocketService.startRoom().subscribe(
      data => {
        console.log("in chat-box component socket: joined main room")
        this.SocketService.emitJoinRoom(this.newJoinedRoomData)
      }
    )
  }

  //checking if user is in the room, if not only then join button will be visible
  //used: Array.prototype.some()
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some 
  public checkUserPresenceInChatRoom: any = (chatRoom) => {
    if (Array.isArray(chatRoom.chatRoomMembers)) {
      let foundUserNew = chatRoom.chatRoomMembers.some((chatRoomMember) => {
        return chatRoomMember.userId === this.userInfo.userId;
      })
      return !foundUserNew
    }
  }


  //listen event: notification
  //for notifications in main room like user came online or user msg
  public getMainRoomData: any = () => {
    this.SocketService.getNotifications().subscribe(
      (data) => {        
        this.toastr.info(data)       
        
      }
    )
  }


  //get the chat rooms created or joined by by the logged-in user
  public getMyChatRooms: any = () => {
    this.AppService.getMyChatRooms(this.userInfo.userId).subscribe(
      data => {
        this.myChatRooms = data['data'];
        console.log("myChatRooms: " + JSON.stringify(this.myChatRooms))
      }
    )
  }

  //get all currently active chat rooms 
  public getAllChatRooms = () => {
    this.AppService.getAllChatRooms().subscribe(
      data => {
        this.allChatRooms = data['data']
        console.log("allChatRooms: " + JSON.stringify(this.allChatRooms))
      }
    )
  }

  public navigate: any = (chatRoom) => {
    this.router.navigate(['/mainChatWindow', chatRoom.chatRoomId])
  }


  //create a new ChatRoom
  public createChatRoom = () => {
    console.log("createChatRoom clicked")
    let data: chatRoom = {
      chatRoomName: this.chatRoomName,
      ownerId: this.userInfo.userId,
      ownerName: this.userName,
      chatRoomMembers: [{ userId: this.userInfo.userId, userName: this.userName }]
    }

    //emit: to create an new ChatRoom
    this.SocketService.createChatRoom(data)
    //listen: that a new ChatRoom has been cretaed and saved
    this.SocketService.chatRoomCreated(this.userInfo.userId).subscribe(
      data => {
        console.log("in chat-box component: Created new chat room")
        this.router.navigate(['/mainChatWindow', data.chatRoomId])
      }
    )
    this.chatRoomName = ''
  }



  //pushing globally into the roomList which is visible to every signed up user
  public addToMainRoom = () => {
    /* display chat rooms list in main room, while also updating the list
     if a new chat room is added/created recently by the logged-in user*/
    this.SocketService.getNewlyCreatedChatRoom().subscribe(
      (data) => {
        if (Array.isArray(this.allChatRooms)) {
          this.allChatRooms.push(data)
          this.addNewChatRoomToMyChatRoomList(data)
        } else {
          this.allChatRooms = []
          this.allChatRooms.push(data)
          this.addNewChatRoomToMyChatRoomList(data)
        }
      })
  }

  public addNewChatRoomToMyChatRoomList = (data) => {
    let currentUser = { userId: this.userInfo.userId, userName: this.userName }
    if (!(JSON.stringify(data.chatRoomMembers).includes(JSON.stringify(currentUser))) ) {      
      if (Array.isArray(this.myChatRooms)) {
        this.myChatRooms.push(data)
      } else {
        this.myChatRooms = []
        this.myChatRooms.push(data)
      }
    }
  }

  //update/refresh the main room after any updates in any chat room 
  public updateMainRoomOnEdit = () => {
    this.SocketService.updateMainRoomOnEdit().subscribe(
      data => {
        if (Array.isArray(this.allChatRooms)) {
          let indexToEdit = this.allChatRooms.map(function (chatRoom) {
            return chatRoom.chatRoomId
          }).indexOf(data.chatRoomId)

          this.allChatRooms[indexToEdit] = data;
        }
        if (Array.isArray(this.myChatRooms)) {
          let indexToEdit = this.myChatRooms.map(function (chatRoom) {
            return chatRoom.chatRoomId
          }).indexOf(data.chatRoomId)
          if (indexToEdit !== -1) {
            this.myChatRooms[indexToEdit] = data;
          }
        }
      }
    )
  }

  
  //update/refresh the main room after any chat room is left
  public updateMainRoomOnLeave: any = () => {
    this.SocketService.updateMainRoomOnLeave().subscribe(
      data => {
        if (Array.isArray(this.allChatRooms)) {
          let indexToLeave = this.allChatRooms.map(function (chatRoom) {
            return chatRoom.chatRoomId
          }).indexOf(data.chatRoomId)

          this.allChatRooms[indexToLeave] = data;
        }
        if (Array.isArray(this.myChatRooms)) {
          let indexToLeave = this.myChatRooms.map(function (chatRoom) {
            return chatRoom.chatRoomId
          }).indexOf(data.chatRoomId)

          this.myChatRooms[indexToLeave] = data;
        }
      }
    )
  }

  //update/refresh the main room after any chat room is deleted 
  public updateMainRoomOnDelete: any = () => {
    this.SocketService.updateMainRoomOnDelete().subscribe(
      data => {
        if (Array.isArray(this.allChatRooms)) {
          let indexToDelete = this.allChatRooms.map(function (chatRoom) {
            return chatRoom.chatRoomId
          }).indexOf(data)

          this.allChatRooms.splice(indexToDelete, 1)
        }
        if (Array.isArray(this.myChatRooms)) {
          let indexToDelete = this.myChatRooms.map(function (chatRoom) {
            return chatRoom.chatRoomId
          }).indexOf(data)

          if (indexToDelete !== -1) {
            this.myChatRooms.splice(indexToDelete, 1)
          }
        }

      }
    )
  }

  public logout: any = () => {

    this.AppService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          Cookie.delete('authToken');
          Cookie.delete('userId');
          Cookie.delete('userName');

          this.SocketService.disconnect();
          this.router.navigate(['/']);//navigating to signin page
        }
        else {
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        this.toastr.error('some error occured');
      });//end subscribe
  }//end logout

  public authError: any = () => {
    this.SocketService.authError().subscribe(
      data => {
        this.toastr.error(data.error)
      }
    )
  }  

}