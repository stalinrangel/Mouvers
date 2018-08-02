import { Injectable } from '@angular/core';

//Mis imports
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../ruta-base/ruta-base.service';

import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';

export class ChatMessage {
  id: string;
  usuario_id: number;
  userAvatar: string;
  created_at: number | string;
  msg: string;
  status: number;
  nameAvatar: string;
}

export class UserInfo {
  id: string;
  avatar?: string;
}


@Injectable()
export class ComentariosService {

	public datos: any;
	public mensajes: any = [];

  constructor(private http: HttpClient,
              private rutaService: RutaBaseService) {

	console.log('Hello ComentariosService');	  
	             
  }

	mockNewMsg(msg) {
	    const mockMsg: ChatMessage = {
	      id: Date.now().toString(),
	      usuario_id: 2329382,
	      userAvatar: msg.toUserAvatar,
	      nameAvatar: msg.nameAvatar,
	      created_at: Date.now(),
	      msg: msg.message,
	      status: 1
	    };

	    setTimeout(() => {
	      //this.events.publish('chat:received', mockMsg, Date.now())
	    }, Math.random() * 1800)
	}

	getMsgList(blog_id): Observable<ChatMessage[]> {

		return Observable.create(observer => {
		    this.http.get(this.rutaService.getRutaApi()+'blogs/'+blog_id+'?token='+localStorage.getItem('mouvers_token'))
		    .toPromise()
		    .then(
			data => {
				//console.log(data);
				this.datos = data;
				this.mensajes = this.datos.blog.msgs;
				for (var i = 0; i < this.mensajes.length; ++i) {
					this.mensajes[i].userAvatar = this.mensajes[i].usuario.imagen;
					this.mensajes[i].nameAvatar = this.mensajes[i].usuario.nombre;
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
