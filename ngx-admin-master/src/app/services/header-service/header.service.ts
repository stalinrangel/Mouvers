import { Injectable } from '@angular/core';

//Mis imports
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../ruta-base/ruta-base.service';

@Injectable()
export class HeaderService {

	//Arrays para los chats
	public conversationsCli = [];
	public conversationsRep = [];

	//Array para los pedidos sin repartidor y los nuevos blogs
	public notificationsCli = [];

	public data:any;

  constructor(private http: HttpClient,
              private rutaService: RutaBaseService) { }

  	//----Funciones para los chats

	getConversationsCli(){
		return this.conversationsCli;
	}

	getConversationsRep(){
		return this.conversationsRep;
	}

	//agregar mensaje al principio del array
	addConversation(mensaje){
		var existe = false;
		if (mensaje.emisor.tipo_usuario == 2) {
			for (var i = 0; i < this.conversationsCli.length; ++i) {
				if (this.conversationsCli[i].chat_id == mensaje.chat_id &&
					this.conversationsCli[i].emisor_id == mensaje.emisor_id &&
					this.conversationsCli[i].receptor_id == mensaje.receptor_id) {
					this.conversationsCli[i].msg = mensaje.msg;
					this.conversationsCli[i].created_at = mensaje.created_at;
					this.conversationsCli[i].emisor.token_notificacion = mensaje.emisor.token_notificacion;
					existe = true;
					break;
				}
			}
			if (!existe) {
				this.conversationsCli.unshift(mensaje);
			}
			
		}else if (mensaje.emisor.tipo_usuario == 3) {
			for (var i = 0; i < this.conversationsRep.length; ++i) {
				if (this.conversationsRep[i].chat_id == mensaje.chat_id &&
					this.conversationsRep[i].emisor_id == mensaje.emisor_id &&
					this.conversationsRep[i].receptor_id == mensaje.receptor_id) {
					this.conversationsRep[i].msg = mensaje.msg;
					this.conversationsRep[i].created_at = mensaje.created_at;
					this.conversationsRep[i].emisor.token_notificacion = mensaje.emisor.token_notificacion;
					existe = true;
					break;
				}
			}
			if (!existe) {
				this.conversationsRep.unshift(mensaje);
			}
		}
		
	}

	//agregar mensaje al final del array
	pushConversation(mensaje){
		if (mensaje.emisor.tipo_usuario == 2) {
			this.conversationsCli.push(mensaje);
		}else if (mensaje.emisor.tipo_usuario == 3) {
			this.conversationsRep.push(mensaje);
		}
		
	}

	//elimina un mensaje del array pasandole el indice
	clearConversation(mensaje, indice){
		if (mensaje.emisor.tipo_usuario == 2) {
			this.conversationsCli.splice(indice, 1);
		}else if (mensaje.emisor.tipo_usuario == 3) {
			this.conversationsRep.splice(indice, 1);
		}
		
	}

	//elimina un mensaje del array pasandole los ids de emisor y receptor
	clearConversationAux(mensaje){
		var indice = null;

		if (mensaje.emisor.tipo_usuario == 2) {
			for (var i = 0; i < this.conversationsCli.length; i++) {
				if (this.conversationsCli[i].chat_id == mensaje.chat_id &&
					this.conversationsCli[i].emisor_id == mensaje.emisor_id &&
					this.conversationsCli[i].receptor_id == mensaje.receptor_id &&
					this.conversationsCli[i].emisor.tipo_usuario == mensaje.emisor.tipo_usuario) {
					this.conversationsCli.splice(i, 1);
					break;
				}
			}
			
		}else if (mensaje.emisor.tipo_usuario == 3) {
			for (var i = 0; i < this.conversationsRep.length; i++) {
				if (this.conversationsRep[i].chat_id == mensaje.chat_id &&
					this.conversationsRep[i].emisor_id == mensaje.emisor_id &&
					this.conversationsRep[i].receptor_id == mensaje.receptor_id &&
					this.conversationsRep[i].emisor.tipo_usuario == mensaje.emisor.tipo_usuario) {
					this.conversationsRep.splice(i, 1);
					break;
				}
			}

		}
		
	}

	//vaciar los arrays
	ressetConversations(){
		this.conversationsCli = [];
		this.conversationsRep = [];
		
	}

	//vaciar el array cli
	ressetConversationsCli(){
		this.conversationsCli = [];
		
	}

	//vaciar el array rep
	ressetConversationsRep(){
		this.conversationsRep = [];
		
	}


	//----Funciones para los pedidos y blogs

	getNotificationsCli(){
		return this.notificationsCli;
	}

	//agregar notification al principio del array
	addNotificationCli(notification){
		this.notificationsCli.unshift(notification);
	}

	//agregar notification al final del array
	pushNotificationCli(notification){
		this.notificationsCli.push(notification);
	}

	//elimina una notificacion del array pasandole el indice
	clearNotificationCli(indice){
		this.notificationsCli.splice(indice, 1);
	}

	//elimina una notificacion del array pasandole pedido_id
	clearNotificationCliAux(pedido_id){
		for (var i = 0; i < this.notificationsCli.length; i++) {
			if (this.notificationsCli[i].id == pedido_id && this.notificationsCli[i].accion != '4') {
				this.notificationsCli.splice(i, 1);
			}
		}
		
	}

	//vaciar el array notificationsCli
	ressetNotificationsCli(){
		this.notificationsCli = [];
	}

	


}
