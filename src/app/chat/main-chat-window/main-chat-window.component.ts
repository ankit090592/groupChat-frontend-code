import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { chatRoom } from '../chat-box/chatRoom-interface';
import { ChatMessage } from '../chat-box/chat';

@Component({
  selector: 'app-main-chat-window',
  templateUrl: './main-chat-window.component.html',
  styleUrls: ['./main-chat-window.component.css'],
  providers: [SocketService, Location]
})
export class MainChatWindowComponent implements OnInit {
  //Creating an html id like reference to handle that html element from here/ through JS
  @ViewChild('scrollMe', { read: ElementRef })
  //scrollMe - declared like a property in this component to be used
  public scrollMe: ElementRef;

  public chatRoomId: any;
  public curChatRoomData: any;
  public curChatRoomOwnerId:any;
  public userInfo: any;
  public userName: any;
  public authToken: any;
  public joinRoomData: any;
  public chatRoomStatus: any;
  public chatRoomName: any;
  //chatMsgInput: for taking chat message as input from user
  public chatMsgInput: any;
  public pageValue: any = 0;
  public loadingPreviousChat: boolean = false;
  public isTyping: boolean = false;
  public userTyping: any;
  public messageList = [];
  public scrollToChatTop: boolean;
  public inviteEmail: any;
  constructor(public AppService: AppService, private location: Location, private router: Router, private toastr: ToastrService, private socketService: SocketService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.chatRoomId = this.activatedRoute.snapshot.paramMap.get('chatRoomId')
    this.userInfo = this.AppService.getUserInfoFromLocalStorage()
    console.log("userInfo in main-chat-window:" +JSON.stringify(this.userInfo));
    this.userName = Cookie.get("userName")
    this.authToken = Cookie.get('authToken')
    this.scrollToChatTop = false;
    this.getSelectedChatRoom()
    this.verifyUserConfirmation()
        
    this.joinChatRoom()
    //for listening any type of update in a chat room like edit name, change status, delete etc.
    this.listenChatRoomUpdates()
    this.onChatRoomLeft()
    this.backToMainRoom()
    this.receiveMsgInAChatRoom()
    this.onTyping()
    this.authError()
  }


  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      data => {
        this.socketService.setUser(this.authToken)
      }
    )
  }

  public joinChatRoom: any = () => {
    let data = {
      chatRoomId: this.chatRoomId,
      userId: this.userInfo.userId,
      userName: this.userName
    }
    this.joinRoomData = data
    this.socketService.startRoom().subscribe(
      data => {
        this.socketService.emitJoinRoom(this.joinRoomData)
      }
    )
  }

  public getSelectedChatRoom: any = () => {
    this.AppService.getSingleChatRoom(this.chatRoomId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.curChatRoomData = apiResponse['data'];
          this.curChatRoomOwnerId = this.curChatRoomData.ownerId
          console.log("currentChatRoomData in main-chat-window:" +JSON.stringify(this.curChatRoomData));
          console.log("ownerId in currentChatRoomData in main-chat-window:" +this.curChatRoomData.ownerId);
          this.chatRoomName = this.curChatRoomData['chatRoomName']
          console.log("chatRoomName:" +this.chatRoomName)
          this.chatRoomStatus = this.curChatRoomData.chatRoomStatus;

          this.pageValue = 0;

          this.addChatRoomMember()
          this.getChatRoomMessages()
        }
      }, err => {
        console.log(err.message)
      }
    )
  }

  public addChatRoomMember: any = () => {
    this.socketService.addChatRoomMember().subscribe(
      data => {
        let newUser = { userId: data.userId, userName: data.userName }
        
        if (!(JSON.stringify(this.curChatRoomData.chatRoomMembers).includes(JSON.stringify(newUser)))) {
          
          this.curChatRoomData.chatRoomMembers.push({ userId: data.userId, userName: data.userName })
          
          if (data.userId != this.userInfo.userId) { this.toastr.success('joined.', data.userName) }

        }
      }
    )
  }

  public sendInvite: any = () => {

    this.AppService.sendInvite(this.inviteEmail,this.chatRoomId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.toastr.info("Mail sent successfully.","Invite sent!")
        } else {
          this.toastr.warning('Error in sending invite!')
        }
      }, err => {
        console.log(err.message)
      }
    )
  }

  public getChatRoomMessages: any = () => {
    this.AppService.getChatRoomMessages(this.chatRoomId, this.pageValue).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.messageList = apiResponse['data']
        } else {
          this.messageList = [];
          this.toastr.warning('No one has chatted yet!')
        }

      }, err => {
        console.log(err.message)
      }
    )
    this.scrollToChatTop = false;
  }

  public goBackToPreviousPage: any = () => {
    this.location.back()
  }

  //for listening any type of update in a chat room like edit name, change status, leave, delete
  public listenChatRoomUpdates = () => {
    this.socketService.listenChatRoomUpdates().subscribe(
      data => {
        this.curChatRoomData = data;
      }
    )
  }

  public editChatRoom = () => {
    let data: chatRoom = {
      chatRoomId: this.chatRoomId,
      chatRoomName: this.chatRoomName,
      ownerId: this.userInfo.userId,
      ownerName: this.userName
    }
    this.socketService.editChatRoom(data)
  }

  public changeChatRoomStatus: any = (userResponse) => {
    this.chatRoomStatus = userResponse
    let data = {
      chatRoomId: this.chatRoomId,
      chatRoomStatus: this.chatRoomStatus
    }
    this.socketService.changeChatRoomStatus(data)
  }

  //emit event: leave chat room
  public leaveChatRoom: any = () => {
    let data = {
      chatRoomId: this.chatRoomId,
      userId: this.userInfo.userId,
      userName: this.userName
    }
    this.socketService.leaveChatRoom(data)
    this.router.navigate(['chatRoom'])
  }

  //listen event: confirmation that a user has left the chat room
  public onChatRoomLeft: any = () => {
    this.socketService.onChatRoomLeft().subscribe(
      data => {
        let indexToRemove = this.curChatRoomData.chatRoomMembers.map(function (user) { 
          return user.userId }).indexOf(data.userId)
        this.curChatRoomData.chatRoomMembers.splice(indexToRemove, 1)
        if (data.userId != this.userInfo.userId) { this.toastr.error('left.', data.userName) }
      }
    )
  }

  public deleteChatRoom: any = () => {
    let chatRoomId = this.chatRoomId
    this.socketService.deleteChatRoom(chatRoomId)
  }

  public backToMainRoom: any = () => {
    this.socketService.backToMainRoom().subscribe(
      data => {
        this.router.navigate(['chatRoom'])
        this.toastr.error(data)
      }
    )
  }

  public loadPreviousChat: any = () => {
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChats()
  }

  public getPreviousChats: any = () => {
    this.AppService.getChatRoomMessages(this.chatRoomId, this.pageValue * 10).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.messageList = apiResponse.data.concat(this.messageList)
        } else {
          this.toastr.warning('No more chats.', 'You have reached the end!')
        }

      }, err => {
        console.log(err.message)
      }
    )
    this.loadingPreviousChat = false;
  }

  public sendMessageUsingKeypress: any = (event: any) => {
    if (event.keyCode === 13) { // 13 is keycode of enter.
      this.sendMsgInAChatRoom();
    } else {
      this.socketService.emitTyping(this.userInfo)
    }
  }

  public onTyping: any = () => {
    let timeout = null
    this.socketService.onTyping().subscribe(
      data => {
        clearTimeout(timeout)
        this.isTyping = true;
        this.userTyping = data.firstName
        //
        timeout = setTimeout(() => {
          this.isTyping = false
        }, 500)
      }
    )
  }
  public sendMsgInAChatRoom: any = () => {

    if (this.chatMsgInput) {
      let chatMsgObject: ChatMessage = {
        senderId: this.userInfo.userId,
        senderName: this.userName,
        message: this.chatMsgInput,
        chatRoomId: this.chatRoomId,
        createdOn: new Date()
      }

      if (Array.isArray(this.messageList)) {
        this.messageList.push(chatMsgObject)
      } else {
        this.messageList = []
        this.messageList.push(chatMsgObject)
      }
      this.socketService.sendMsgInChatRoom(chatMsgObject)
      this.chatMsgInput = ''
      this.scrollToChatTop = false;
    }
    else {
      this.toastr.error('Type something to send.', 'No input!')
    }
  }

  public receiveMsgInAChatRoom: any = () => {
    this.socketService.receiveRoomMessage().subscribe(
      data => {
        this.isTyping = false;
        if (Array.isArray(this.messageList)) {
          this.messageList.push(data)
        } else {
          this.messageList = []
          this.messageList.push(data)
        }
      }
    )
    this.scrollToChatTop = false;
  }

  public authError: any = () => {
    this.socketService.authError().subscribe(
      data => {
        this.toastr.error(data.error)
      }
    )
  }

}
