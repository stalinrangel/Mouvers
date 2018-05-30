import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Events, Content, Loading, LoadingController } from 'ionic-angular';
import { ChatServiceProvider, ChatMessage, UserInfo } from "../../providers/chat-service/chat-service";
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage'; 
import { HttpClient } from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal';


@Component({
  selector: 'page-chat-support',
  templateUrl: 'chat-support.html',
})
export class ChatSupportPage {

	@ViewChild(Content) content: Content;
	@ViewChild('chat_input') messageInput: ElementRef;
	msgList: ChatMessage[] = [];
	user: UserInfo;
	toUser: UserInfo;
	editorMsg = '';
	loading: Loading;
	showEmojiPicker = false;

	public usuario: any;
	public datos: any;
	public admin_id: string = '';
	public chat_id: string = '';
	public token_notificacion: string = '';
	public send_msg = {
		emisor_id: 0,
	  	receptor_id: 0,
	  	msg: '',
	  	emisor: 'cliente',
	  	token_notificacion: '',
	  	token: '',
	  	chat_id: ''
	}

  constructor(navParams: NavParams, private chatService: ChatServiceProvider, private events: Events, public storage: StorageProvider, private rutebaseApi: RuteBaseProvider, public http: HttpClient, public loadingCtrl: LoadingController, private oneSignal: OneSignal, public cdr: ChangeDetectorRef) {

  	this.admin_id = navParams.get('admin_id');
  	this.chat_id = navParams.get('chat_id');
  	this.token_notificacion = navParams.get('token_notificacion');  
    this.usuario = this.storage.getObject('userMouver');
    this.toUser = {
      id: this.admin_id
    };

    this.chatService.getUserInfo(this.usuario)
    .then((res) => {
      this.user = res
    });
  }

	ionViewWillLeave() {
		this.events.unsubscribe('chat:received');
	}

	ionViewDidEnter() {
		if (this.chat_id != '') {
			this.msgList = [];
			this.showLoading('Cargando conversación');
			this.getMsg();
		}		

		this.events.subscribe('chat:received', msg => {
			let newMsg: ChatMessage = {
			  id: Date.now().toString(),
			  emisor_id: parseInt(this.toUser.id),
			  userAvatar: this.user.avatar,
			  receptor_id: parseInt(this.user.id),
			  created_at: Date.now(),
			  msg: msg.msg,
			  status: 2
			};
			this.pushNewMsg(newMsg);
			this.cdr.detectChanges();
		})
	}

	getMsg() {
	    return this.chatService.getMsgList(this.chat_id
	    	).subscribe(res => {
	        this.msgList = res;
	        this.scrollToBottom();
	        this.loading.dismiss();
	    });
	}

	onFocus() {
		this.content.resize();
		this.scrollToBottom();
	}

	sendMsg() {
		if (!this.editorMsg.trim()) return;

		const id = Date.now().toString();
		
		let newMsg: ChatMessage = {
		  id: Date.now().toString(),
		  emisor_id: parseInt(this.user.id),
		  userAvatar: this.user.avatar,
		  receptor_id: parseInt(this.toUser.id),
		  created_at: Date.now(),
		  msg: this.editorMsg,
		  status: 1
		};

		this.pushNewMsg(newMsg);
		this.chatService.sendMsg(newMsg).then(() => {})
		this.sendMsgServer(this.editorMsg,id);
		this.editorMsg = '';
		 
	}

	sendMsgServer(msg,id){
		this.send_msg.emisor_id = parseInt(this.usuario.id);
		this.send_msg.receptor_id = parseInt(this.admin_id);
		this.send_msg.msg = msg;
		this.send_msg.token_notificacion = this.token_notificacion;
		this.send_msg.chat_id = this.chat_id;
		this.http.post(this.rutebaseApi.getRutaApi()+'chats/clientes/mensaje', this.send_msg)
	    .toPromise()
	    .then(
		data => {
			this.datos = data;
			this.chat_id = this.datos.chat.id;
			this.admin_id = this.datos.chat.admin_id;
			this.token_notificacion = this.datos.msg.token_notificacion;	
			let index = this.getMsgIndexById(id);
			if (index !== -1) {
			  this.msgList[index].status = 2;
			}
		},
		msg => {
			console.log(msg);
			let index = this.getMsgIndexById(id);
			if (index !== -1) {
			  this.msgList[index].status = 3;
			}
		});
	}

	pushNewMsg(msg: ChatMessage) {
		const userId = parseInt(this.user.id),
		toUserId = parseInt(this.toUser.id);
		
		if (msg.emisor_id === userId && msg.receptor_id === toUserId) {
		  this.msgList.push(msg);
		} else if (msg.receptor_id === userId && msg.emisor_id === toUserId) {
		  this.msgList.push(msg);
		}
		this.scrollToBottom();
	}

	getMsgIndexById(id: string) {
		return this.msgList.findIndex(e => e.id === id)
	}

	scrollToBottom() {
		setTimeout(() => {
		  if (this.content.scrollToBottom) {
		    this.content.scrollToBottom();
		  }
		}, 400)
	}

	private setTextareaScroll() {
		const textarea = this.messageInput.nativeElement;
		textarea.scrollTop = textarea.scrollHeight;
	}

	showLoading(text) {
	    this.loading = this.loadingCtrl.create({
	      content: text,
	      spinner: 'ios'
	    });
	    this.loading.present();
	}

}
