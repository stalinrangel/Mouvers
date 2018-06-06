import { Injectable } from '@angular/core';

//Mis imports
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../ruta-base/ruta-base.service';

import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';

export class Conversation {
	id: number;
	admin_id: number;
	usuario_id: number;
	created_at: number | string;
	updated_at: number | string;
	ultimo_msg: {
	    id: number;
	    msg: string;
	    created_at: number | string;
	};
	usuario: {
	    id: number;
	    nombre: string;
	    imagen: string;
	    tipo_usuario: number;
	    token_notificacion: string;
	};
}

@Injectable()
export class ConversationsCliService {

	private conversations: Conversation[];

	private conversations$: Subject<Conversation[]> = new Subject<Conversation[]>();

  constructor(private http: HttpClient,
              private rutaService: RutaBaseService) { 
  	console.log('Hello ConversationsCliService');
  	this.conversations = [];
  }

	getConversations$(): Observable<Conversation[]> {
		return this.conversations$.asObservable();
	}

	agregarConversation(conversation: Conversation) {
		this.conversations.push(conversation);
		this.conversations$.next(this.conversations);
	}

	getConversas() {
		return this.conversations;
	}

	updateConversa(chat_id, usuario_id, token_notificacion) {
		for (var i = 0; i < this.conversations.length; ++i) {
			if (this.conversations[i].id == 0 || this.conversations[i].usuario.id == usuario_id) {
				this.conversations[i].id = chat_id;
				this.conversations[i].usuario.token_notificacion = token_notificacion;
			}
		}

		this.conversations$.next(this.conversations);
	}

	resetConversas() {
		this.conversations = [];
	}

	deleteConversation(chat_id){
		var aux = this.conversations;

		this.conversations = [];

		for (var i = 0; i < aux.length; ++i) {
			if (chat_id != aux[i].id) {
				this.conversations.push(aux[i]);
			}
		}

		this.conversations$.next(this.conversations);

	}

}
