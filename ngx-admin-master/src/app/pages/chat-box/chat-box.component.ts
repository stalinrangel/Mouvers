import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../services/ruta-base/ruta-base.service';

import { FormBuilder, FormArray, FormGroup, Validators  } from '@angular/forms';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ChatService, ChatMessage, UserInfo } from "../../services/chat-service/chat.service";
import { ConversationsService, Conversation } from "../../services/conversations-service/conversations.service";

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ngx-chat-box',
  styleUrls: ['./chat-box.component.scss'],
  templateUrl: './chat-box.component.html',
})

export class ChatBoxComponent implements OnInit{

	//----Alertas---<
	config: ToasterConfig;

	position = 'toast-top-right';
	animationType = 'fade';
	title = 'HI there!';
	content = `I'm cool toaster!`;
	timeout = 5000;
	toastsLimit = 5;
	type = 'default'; // 'default', 'info', 'success', 'warning', 'error'

	isNewestOnTop = true;
	isHideOnClick = true;
	isDuplicatesPrevented = false;
	isCloseButton = true;
	//----Alertas--->

	private data:any;
	public loading = false;

	//Datos del admin logeado
	//public admin_id = localStorage.getItem('mouvers_user_id');

	//Datos de la persona(cliente-repartidor) seleccionada para ver el chat
	//public chat_id = localStorage.getItem('mouvers_chat_id');
	public chat_nombre = localStorage.getItem('mouvers_chat_nombre');
	public chat_tipo_usuario = localStorage.getItem('mouvers_chat_tipo_usuario');

	public chat = [];
	public msg:any;

	//Manejo del chat
	//@ViewChild(Content) contentM: Content;
	@ViewChild('scrollChat') chatContent: ElementRef;
	msgList: ChatMessage[] = [];
	user: UserInfo;
	toUser: UserInfo;
	editorMsg = '';
	showEmojiPicker = false;

	public usuario: any;
	public datos: any;
	public admin_id: string = '';
	public admin_imagen: string = '';
	public chat_id: string = '';
	public usuario_id: string = '';
	public usuario_tipo: string = '';
	public usuario_nombre: string = '';
	public usuario_imagen: string = '';
	public token_notificacion: string = '';
	public send_msg = {
		emisor_id: 0,
	  	receptor_id: 0,
	  	msg: '',
	  	emisor: 'admin',
	  	token_notificacion: '',
	  	token: '',
	  	chat_id: ''
	}

	conversations: Conversation[] = [];
  	conversations$: Observable<Conversation[]>;

	constructor( private modalService: NgbModal,
	       private toasterService: ToasterService,
	       private http: HttpClient,
	       private router: Router,
	       private rutaService: RutaBaseService,
	       public fb: FormBuilder,
	       private chatService: ChatService,
	       private conversationsService: ConversationsService)
	{

		//Datos del admin
		this.admin_id = localStorage.getItem('mouvers_user_id');
		this.admin_imagen = localStorage.getItem('mouvers_user_imagen');

		//Datos del ususario (cliente/repartidor)
	  	this.chat_id = localStorage.getItem('mouvers_chat_id');
	  	this.usuario_id = localStorage.getItem('mouvers_usuario_id');
	  	this.usuario_tipo = localStorage.getItem('mouvers_usuario_tipo');
	  	this.usuario_nombre = localStorage.getItem('mouvers_usuario_nombre');
	  	this.usuario_imagen = localStorage.getItem('mouvers_usuario_imagen');
	    this.token_notificacion = localStorage.getItem('mouvers_usuario_token_notifi');
	   
	    this.toUser = {
	      id: this.usuario_id
	    };

	    this.chatService.getUserInfo(this.admin_id, this.admin_imagen)
	    .then((res) => {
	      this.user = res
	    });
	}


	ngOnInit() {
		//get message list
		if (this.chat_id != '') {
			this.getMsg();
		}

		// Subscribe to received  new message events
		/*this.events.subscribe('chat:received', msg => {

		  this.pushNewMsg(msg);
		  console.log(msg)
		})*/

		this.conversations$ = this.conversationsService.getConversationsClientes$();
    	this.conversations$.subscribe(conversations => this.conversations = conversations);

    	//this.initConversationsClientes();
    	//console.log(this.conversationsService.getConversas());
    	this.conversations = this.conversationsService.getConversas();

	}

	getMsg() {
	    return this.chatService.getMsgList(this.chat_id, this.usuario_tipo
	    	).subscribe(res => {
	        this.msgList = res;
	        this.scrollToBottom();
	    });
	}

	enterMsg(event:any){
	   if(event.keyCode == 13){
	      this.sendMsg();
	      event.preventDefault();
	   }
	}

	sendMsg() {
		if (!this.editorMsg.trim()) return;

		// Mock message
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

		//Peticion a la tabla de mensajes de los clientes
		if (this.usuario_tipo == '2') {
			var url_final = 'clientes';
		}
		//Peticion a la tabla de mensajes de los repartidores
		else if (this.usuario_tipo == '3'){
			var url_final = 'repartidores';
		}

		this.send_msg.emisor_id = parseInt(this.admin_id);
		this.send_msg.receptor_id = parseInt(this.usuario_id);
		this.send_msg.msg = msg;
		this.send_msg.token_notificacion = this.token_notificacion;
		this.send_msg.chat_id = this.chat_id;
		this.send_msg.token = localStorage.getItem('mouvers_token');
		console.log(this.send_msg);

		this.http.post(this.rutaService.getRutaApi()+'mouversAPI/public/chats/'+url_final+'/mensaje', this.send_msg)
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
		  this.chatContent.nativeElement.scrollTop = this.chatContent.nativeElement.scrollHeight;
		}, 400)
	}

	deletChat(){
		console.log('entro');
	}

	private showToast(type: string, title: string, body: string) {
	  this.config = new ToasterConfig({
	    positionClass: this.position,
	    timeout: this.timeout,
	    newestOnTop: this.isNewestOnTop,
	    tapToDismiss: this.isHideOnClick,
	    preventDuplicates: this.isDuplicatesPrevented,
	    animation: this.animationType,
	    limit: this.toastsLimit,
	  });
	  const toast: Toast = {
	    type: type,
	    title: title,
	    body: body,
	    timeout: this.timeout,
	    showCloseButton: this.isCloseButton,
	    bodyOutputType: BodyOutputType.TrustedHtml,
	  };
	  this.toasterService.popAsync(toast);
	}

	enviarMensaje() {

		//Peticion a la tabla de mensajes de los clientes
		if (this.chat_tipo_usuario == '2') {
			var url_final = 'cliente';
		}
		//Peticion a la tabla de mensajes de los repartidores
		else{
			var url_final = 'repartidor';
		}

		//this.loading = true;

		var datos= {
	        token: localStorage.getItem('mouvers_token'),
	        msg: this.msg,
	        estado: 1,
	        emisor_id: this.admin_id,
	        receptor_id: this.chat_id,
	      }
	    console.log(datos);

		setTimeout(()=>{
			this.msg = null;
		},6);

		this.http.post(this.rutaService.getRutaApi()+'mouversAPI/public/mensajes/'+url_final, datos)
		   .toPromise()
		   .then(
		     data => { // Success
		       console.log(data);

		       //this.loading = false;

		     },
		     msg => { // Error
		       console.log(msg);
		       console.log(msg.error.error);

		       //this.loading = false;

		       //token invalido/ausente o token expiro
		       if(msg.status == 400 || msg.status == 401){ 
		            //alert(msg.error.error);
		            this.showToast('warning', 'Warning!', msg.error.error);
		        }
		        //sin usuarios
		        else { 
		            //alert(msg.error.error);
		            this.showToast('info', 'Info!', msg.error.error);
		        }
		        

		     }
		   );
	}

	/*Actualiza los mensajes de un receptor_id a leidos (estado=2)*/
	leerMensajes(receptor_id, emisor_id) {

		//Peticion a la tabla de mensajes de los clientes
		if (this.chat_tipo_usuario == '2') {
			var url_final = 'cliente/leer';
		}
		//Peticion a la tabla de mensajes de los repartidores
		else{
			var url_final = 'repartidor/leer';
		}

		var datos= {
	        token: localStorage.getItem('mouvers_token'),
	        emisor_id: emisor_id, // cliente/repartidor
	        receptor_id: receptor_id, // admin
	      }

		this.http.put(this.rutaService.getRutaApi()+'mouversAPI/public/mensajes/'+url_final, datos)
		   .toPromise()
		   .then(
		     data => { // Success
		       console.log(data);

		     },
		     msg => { // Error
		       console.log(msg);

		       //token invalido/ausente o token expiro
		       if(msg.status == 400 || msg.status == 401){ 
		            //alert(msg.error.error);
		            this.showToast('warning', 'Warning!', msg.error.error);
		        }
		        
		     }
		   );
	}

	printConversas() {	
		//console.log(this.conversationsService.getConversas());
		console.log(this.conversations);
	}

	addConversa() {	
		const aux: Conversation = {
				id: 6,
				admin_id: 6,
				usuario_id: 6,
				created_at: 'prueba',
				updated_at: 'prueba',
				ultimo_msg: {
				    id: 6,
				    msg: 'prueba',
				    created_at: 'prueba',
				},
				usuario: {
				    id: 6,
				    nombre: 'prueba',
				    imagen: 'prueba',
				    tipo_usuario: 6,
				    token_notificacion: 'prueba',
				},
		};

		this.conversationsService.agregarConversation(aux);
	}

}
