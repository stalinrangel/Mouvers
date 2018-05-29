import { Injectable } from '@angular/core';

//Mis imports
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../ruta-base/ruta-base.service';

import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';

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
export class ChatService {

	public datos: any;
	public mensajes: any = [];

  constructor(private http: HttpClient,
              private rutaService: RutaBaseService) {

	console.log('Hello ChatService');	  
	             
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

	getMsgList(chat_id, usuario_tipo): Observable<ChatMessage[]> {

		//Peticion a la tabla de mensajes de los clientes
		if (usuario_tipo == '2') {
			var url_final = 'clientes';
		}
		//Peticion a la tabla de mensajes de los repartidores
		else if (usuario_tipo == '3'){
			var url_final = 'repartidores';
		}

		return Observable.create(observer => {
		    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/chats/'+url_final+'/'+chat_id+'?token='+localStorage.getItem('mouvers_token'))
		    .toPromise()
		    .then(
			data => {
				//console.log(data);
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

	getUserInfo(id, imagen): Promise<UserInfo> {
		const userInfo: UserInfo = {
		  id: id,
		  avatar: imagen
		};
		return new Promise(resolve => resolve(userInfo));
	}

}
