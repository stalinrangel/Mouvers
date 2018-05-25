import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';

export class ChatMessage {
  id: string;
  emisor_id: number;
  userAvatar: string;
  receptor_id: number;
  created_at: number | string;
  msg: string;
  status: number;
}

export class UserInfo {
  id: string;
  avatar?: string;
}

@Injectable()
export class ChatServiceProvider {

	public datos: any;
	public mensajes: any = [];

	constructor(public http: HttpClient, private events: Events, private rutebaseApi: RuteBaseProvider) {
		console.log('Hello ChatServiceProvider Provider');
	}

	mockNewMsg(msg) {
	    const mockMsg: ChatMessage = {
	      id: Date.now().toString(),
	      emisor_id: 2329382,
	      userAvatar: msg.toUserAvatar,
	      receptor_id: 232323,
	      created_at: Date.now(),
	      msg: msg.message,
	      status: 1
	    };

	    setTimeout(() => {
	      //this.events.publish('chat:received', mockMsg, Date.now())
	    }, Math.random() * 1800)
	}

	getMsgList(chat_id): Observable<ChatMessage[]> {
		return Observable.create(observer => {
		    this.http.get(this.rutebaseApi.getRutaApi()+'chats/clientes/'+chat_id)
		    .toPromise()
		    .then(
			data => {
				this.datos = data;
				this.mensajes = this.datos.chat.mensajes;
				for (var i = 0; i < this.mensajes.length; ++i) {
					this.mensajes[i].userAvatar = this.mensajes[i].emisor.imagen;
				}
				observer.next(this.mensajes);
				observer.complete();
			},
			msg => {
				observer.error(msg.error);
				observer.complete();
			}); 
 		});
	}

	sendMsg(msg: ChatMessage) {
		return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
		.then(() => this.mockNewMsg(msg));
	}

	getUserInfo(usuario): Promise<UserInfo> {
		const userInfo: UserInfo = {
		  id: usuario.id,
		  avatar: usuario.imagen
		};
		return new Promise(resolve => resolve(userInfo));
	}

}

