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
export class ConversationsService {

	private conversations: Conversation[];

	private conversations$: Subject<Conversation[]> = new Subject<Conversation[]>();

  constructor(private http: HttpClient,
              private rutaService: RutaBaseService) { 
  	console.log('Hello ConversationsService');
  	this.conversations = [];
  }

	getConversationsClientes$(): Observable<Conversation[]> {
		return this.conversations$.asObservable();
	}

	agregarConversation(conversation: Conversation) {
		this.conversations.push(conversation);
		this.conversations$.next(this.conversations);
	}

	getConversas() {
		return this.conversations;
	}

}
