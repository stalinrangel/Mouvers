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
import { ConversationsCliService, Conversation } from "../../services/conversationsCli-service/conversations-cli.service";
import { ConversationsRepService } from "../../services/conversationsRep-service/conversations-rep.service";

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NbSidebarService } from '@nebular/theme';

import { ViewChatEventService } from '../../services/eventos-services/view-chat-event-service/view-chat-event.service';
import { HeaderToChatEventService } from '../../services/eventos-services/header-to-chat-event-service/header-to-chat-event.service';

import { HeaderService } from '../../services/header-service/header.service';

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
    private productList:any;
	private dataCli:any;
	private dataRep:any;
	public loading = false;
	public loading2 = false;
	public loading3 = false;

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
	};

	conversationsCli: Conversation[] = [];
  	conversationsCli$: Observable<Conversation[]>;
  	conversationsCliSubscription: Subscription;

  	conversationsRep: Conversation[] = [];
  	conversationsRep$: Observable<Conversation[]>;
  	conversationsRepSubscription: Subscription;

  	objAEliminar: any;
	eliminar_id: any;
	eliminar_nombre: any;

	constructor( private sidebarService: NbSidebarService,
		   private modalService: NgbModal,
	       private toasterService: ToasterService,
	       private http: HttpClient,
	       private router: Router,
	       private rutaService: RutaBaseService,
	       public fb: FormBuilder,
	       private chatService: ChatService,
	       private conversationsCliService: ConversationsCliService,
	       private conversationsRepService: ConversationsRepService,
	       private viewChatEventService: ViewChatEventService,
	       private headerToChatEventService: HeaderToChatEventService,
	       private headerService: HeaderService)
	{
		//Detectar evento add msg al chat
		this.viewChatEventService.viewChatData.subscribe(
	      (data: any) => {
	        //console.log(data); 
	        this.addMsgEvent(data);
	    });

	    //Detectar evento cargar chat de notificacion entrante
		this.headerToChatEventService.headerToChatData.subscribe(
	      (data: any) => {
	        //console.log(data); 
	        this.headerEvent(data);
	    });

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

		this.toggleSidebar();

		//alert(this.chat_id);
		
		//get message list
		if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {
			this.getMsg();
		}

		// Subscribe to received  new message events
		/*this.events.subscribe('chat:received', msg => {

		  this.pushNewMsg(msg);
		  console.log(msg)
		})*/

		this.conversationsCli$ = this.conversationsCliService.getConversations$();
    	this.conversationsCliSubscription = this.conversationsCli$.subscribe(conversationsCli => this.conversationsCli = conversationsCli);
    	this.initConversationsCli();
    	//this.conversationsCli = this.conversationsCliService.getConversas();

    	this.conversationsRep$ = this.conversationsRepService.getConversations$();
    	this.conversationsRepSubscription = this.conversationsRep$.subscribe(conversationsRep => this.conversationsRep = conversationsRep);
    	this.initConversationsRep();
    	//this.conversationsRep = this.conversationsRepService.getConversas();

	}

	ngOnDestroy() {
	   // acciones de destrucción
		localStorage.setItem('mouvers_chat_id', '');
		localStorage.setItem('mouvers_usuario_id', '');
		localStorage.setItem('mouvers_usuario_tipo', '');
		localStorage.setItem('mouvers_usuario_nombre', '');
		localStorage.setItem('mouvers_usuario_imagen', '');
		localStorage.setItem('mouvers_usuario_token_notifi', '');

		this.conversationsCliSubscription.unsubscribe();
		this.conversationsRepSubscription.unsubscribe();

	 }

	initConversationsCli() {

      this.conversationsCliService.resetConversas();

      this.loading2 = true;

      this.http.get(this.rutaService.getRutaApi()+'chats/clientes?token='+localStorage.getItem('mouvers_token'))
         .toPromise()
         .then(
           data => { // Success
             //console.log(dataCli);

              this.dataCli=data;
              var chats = this.dataCli.chats;
                 
              for (var i = 0; i < chats.length; ++i) {
               const aux: Conversation = {
                    id: chats[i].id,
                    admin_id: chats[i].admin_id,
                    usuario_id: chats[i].usuario_id,
                    created_at: chats[i].created_at,
                    updated_at: chats[i].updated_at,
                    ultimo_msg: {
                        id: chats[i].ultimo_msg.id,
                        msg: chats[i].ultimo_msg.msg,
                        created_at: chats[i].ultimo_msg.created_at,
                    },
                    usuario: {
                        id: chats[i].usuario.id,
                        nombre: chats[i].usuario.nombre,
                        imagen: chats[i].usuario.imagen,
                        tipo_usuario: chats[i].usuario.tipo_usuario,
                        token_notificacion: chats[i].usuario.token_notificacion,
                    },
                };

                this.conversationsCliService.agregarConversation(aux);
            }

             this.loading2 = false;

             console.log('Chats Clientes:');
             console.log(this.conversationsCliService.getConversas());

           },
           msg => { // Error
             console.log(msg);
             console.log(msg.error.error);

             this.loading2 = false;

             //token invalido/ausente o token expiro
             if(msg.status == 400 || msg.status == 401){ 
                  //alert(msg.error.error);
                  this.showToast('warning', 'Warning!', msg.error.error);
	              	setTimeout(()=>{
	                  this.router.navigateByUrl('/pagessimples/loginf');
	                },1000);
              }

              
           }
         );
    }

	initConversationsRep() {

      this.conversationsRepService.resetConversas();

      this.loading3 = true;

      this.http.get(this.rutaService.getRutaApi()+'chats/repartidores?token='+localStorage.getItem('mouvers_token'))
         .toPromise()
         .then(
           data => { // Success
             //console.log(dataCli);

              this.dataRep=data;
              var chats = this.dataRep.chats;
                 
              for (var i = 0; i < chats.length; ++i) {
               const aux: Conversation = {
                    id: chats[i].id,
                    admin_id: chats[i].admin_id,
                    usuario_id: chats[i].usuario_id,
                    created_at: chats[i].created_at,
                    updated_at: chats[i].updated_at,
                    ultimo_msg: {
                        id: chats[i].ultimo_msg.id,
                        msg: chats[i].ultimo_msg.msg,
                        created_at: chats[i].ultimo_msg.created_at,
                    },
                    usuario: {
                        id: chats[i].usuario.id,
                        nombre: chats[i].usuario.nombre,
                        imagen: chats[i].usuario.imagen,
                        tipo_usuario: chats[i].usuario.tipo_usuario,
                        token_notificacion: chats[i].usuario.token_notificacion,
                    },
                };

                this.conversationsRepService.agregarConversation(aux);
            }

             this.loading3 = false;

             console.log('Chats Repartidores:');
             console.log(this.conversationsRepService.getConversas());

           },
           msg => { // Error
             console.log(msg);
             console.log(msg.error.error);

             this.loading3 = false;

             //token invalido/ausente o token expiro
             if(msg.status == 400 || msg.status == 401){ 
                  //alert(msg.error.error);
                  this.showToast('warning', 'Warning!', msg.error.error);
                  setTimeout(()=>{
	                  this.router.navigateByUrl('/pagessimples/loginf');
	                },1000);
              }

              
           }
         );
    }

	/*Ocultar sidebar*/
	toggleSidebar(): boolean {
		this.sidebarService.toggle(true, 'menu-sidebar');
		return false;
	}

	//Abrir modal por defecto
	open(modal) {
		this.modalService.open(modal);
	}

	//Abrir modal larga
	open2(modal) {
		this.modalService.open(modal , { size: 'lg', backdrop: true, container: 'nb-layout', keyboard: true});
	}

	getMsg() {
		this.loading = true;
		this.msgList = [];
	    return this.chatService.getMsgList(this.chat_id, this.usuario_tipo
	    	).subscribe(res => {
	        this.msgList = res;
	        this.loading = false;
	        this.scrollToBottom();
	        this.clearHeaderConversation();
	        this.putLeer();
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

		if (this.usuario_id == '' || this.usuario_id == 'null' || !this.usuario_id){
			this.showToast('info', 'Info!', 'Debe seleccionar un cliente o un repartidor.');
			return;
		}

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
		this.setUltimoMsg(newMsg);
		 
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

		this.http.post(this.rutaService.getRutaApi()+'chats/'+url_final+'/mensaje', this.send_msg)
	    .toPromise()
	    .then(
		data => {
			console.log(data);
			this.datos = data;
			this.chat_id = (this.datos.chat.id).toString();
			this.admin_id = (this.datos.chat.admin_id).toString();
			this.token_notificacion = this.datos.msg.token_notificacion;	

			//Datos del ususario (cliente/repartidor)
			localStorage.setItem('mouvers_chat_id', this.datos.chat.id);
			localStorage.setItem('mouvers_usuario_id', this.datos.chat.usuario_id);
			localStorage.setItem('mouvers_usuario_tipo', this.usuario_tipo);
			//localStorage.setItem('mouvers_usuario_nombre', usuario_nombre);
			//localStorage.setItem('mouvers_usuario_imagen', usuario_imagen);
			localStorage.setItem('mouvers_usuario_token_notifi', this.datos.msg.token_notificacion);

			let index = this.getMsgIndexById(id);
			if (index !== -1) {
			  this.msgList[index].status = 2;
			}

			/*Actualizar el chat_id en los servicios de las conversas*/
			if (this.usuario_tipo == '2') {
				this.conversationsCliService.updateConversa(this.datos.chat.id, this.datos.chat.usuario_id, this.datos.msg.token_notificacion);

				/*for (var i = 0; i < this.conversationsCli.length; ++i) {
					if (this.conversationsCli[i].id == 0 || this.conversationsCli[i].usuario.id == this.datos.chat.usuario_id) {
						this.conversationsCli[i].id = this.datos.chat.id;
						this.conversationsCli[i].usuario.token_notificacion = this.datos.msg.token_notificacion;
					}
				}*/
			}
			else if (this.usuario_tipo == '3') {
				this.conversationsRepService.updateConversa(this.datos.chat.id, this.datos.chat.usuario_id, this.datos.msg.token_notificacion);

				/*for (var i = 0; i < this.conversationsRep.length; ++i) {
					if (this.conversationsRep[i].id == 0 || this.conversationsRep[i].usuario.id == this.datos.chat.usuario_id) {
						this.conversationsRep[i].id = this.datos.chat.id;
						this.conversationsRep[i].usuario.token_notificacion = this.datos.msg.token_notificacion;
					}
				}*/
			}

			this.clearHeaderConversation2(parseInt(this.chat_id),
            	parseInt(this.usuario_id),
            	parseInt(this.admin_id),
            	parseInt(this.usuario_tipo));
			this.putLeer();

		},
		msg => {
			console.log(msg);
			let index = this.getMsgIndexById(id);
			if (index !== -1) {
			  this.msgList[index].status = 3;
			}

			//token invalido/ausente o token expiro
             if(msg.status == 400 || msg.status == 401){ 
                  //alert(msg.error.error);
                  this.showToast('warning', 'Warning!', msg.error.error);
	              	setTimeout(()=>{
	                  this.router.navigateByUrl('/pagessimples/loginf');
	                },1000);
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

	aEliminar(obj): void {
      this.objAEliminar = obj;
      //console.log(this.objAEliminar);
      this.eliminar_id = this.objAEliminar.id;
      this.eliminar_nombre = this.objAEliminar.usuario.nombre;
    }

	deletChat(){
      console.log(this.objAEliminar);

		//Peticion a la tabla de mensajes de los clientes
		if (this.objAEliminar.usuario.tipo_usuario == '2') {
			var url_final = 'clientes';
		}
		//Peticion a la tabla de mensajes de los repartidores
		else if (this.objAEliminar.usuario.tipo_usuario == '3'){
			var url_final = 'repartidores';
		}
      
      this.loading = true;

      var datos= {
        token: localStorage.getItem('mouvers_token')
      }

      localStorage.setItem('mouvers_chat_id', '');
	  localStorage.setItem('mouvers_usuario_nombre', '');

      this.http.delete(this.rutaService.getRutaApi()+'chats/'+url_final+'/'+this.eliminar_id+'?token='+localStorage.getItem('mouvers_token'))
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

            this.clearHeaderConversation2(parseInt(this.chat_id),
            	parseInt(this.usuario_id),
            	parseInt(this.admin_id),
            	parseInt(this.usuario_tipo));

	            if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {
	              if (parseInt(this.chat_id) == this.eliminar_id && parseInt(this.usuario_id) == this.objAEliminar.usuario.id) {
	              	this.msgList = [];
	              	this.chat_id = '';
	              	this.usuario_nombre = '';
	              }
	          	}

				if (this.objAEliminar.usuario.tipo_usuario == '2') {
					this.conversationsCliService.deleteConversation(this.eliminar_id);

					/*var aux = this.conversationsCli;

					this.conversationsCli = [];

					for (var i = 0; i < aux.length; ++i) {
						if (this.eliminar_id != aux[i].id) {
							this.conversationsCli.push(aux[i]);
						}
					}*/
				}
				else if (this.objAEliminar.usuario.tipo_usuario == '3'){
					this.conversationsRepService.deleteConversation(this.eliminar_id);

					/*var aux = this.conversationsRep;

					this.conversationsRep = [];

					for (var i = 0; i < aux.length; ++i) {
						if (this.eliminar_id != aux[i].id) {
							this.conversationsRep.push(aux[i]);
						}
					}*/
				}

              this.loading = false;
              this.showToast('success', 'Success!', this.data.message);    
           },
           msg => { // Error
             console.log(msg);
             console.log(msg.error.error);

             this.loading = false;

             //token invalido/ausente o token expiro
             if(msg.status == 400 || msg.status == 401){ 
                  //alert(msg.error.error);
                  this.showToast('warning', 'Warning!', msg.error.error);
	              	setTimeout(()=>{
	                  this.router.navigateByUrl('/pagessimples/loginf');
	                },1000);
              }
              //no encontrada o confilto
              else if(msg.status == 404 || msg.status == 409){ 
                  //alert(msg.error.error);
                  this.showToast('error', 'Erro!', msg.error.error);
              }

           }
         );
	}

	refreshChat(){
		//get message list
		if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {

			this.getMsg();

			if (this.usuario_tipo == '2') {
				this.initConversationsCli();
			}
			else if (this.usuario_tipo == '3') {
				this.initConversationsRep();
			}
		}
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

	printConversas() {	
		//console.log(this.conversationsCliService.getConversas());
		console.log(this.conversationsCli);
		console.log(this.conversationsRep);
	}

	addConversa(msg) {	
		const aux: Conversation = {
				id: 0,
				admin_id: parseInt(this.admin_id),
				usuario_id: parseInt(this.usuario_id),
				created_at: msg.created_at,
				updated_at: msg.created_at,
				ultimo_msg: {
				    id: msg.id,
				    msg: msg.msg,
				    created_at: msg.created_at,
				},
				usuario: {
				    id: parseInt(this.usuario_id),
				    nombre: this.usuario_nombre,
				    imagen: this.usuario_imagen,
				    tipo_usuario: parseInt(this.usuario_tipo),
				    token_notificacion: this.token_notificacion,
				},
		};

		if (this.usuario_tipo == '2') {
			this.conversationsCliService.agregarConversation(aux);
		}
		else if (this.usuario_tipo == '3') {
			this.conversationsRepService.agregarConversation(aux);
		}
		
	}

	/*Cargar el chat de una conversa de la lista*/
	getChatOfConversa(conversa) {

		if (conversa.usuario.id != this.usuario_id) {
			//console.log(conversa);
		    this.setUsuario(conversa.id,conversa.usuario.id,conversa.usuario.tipo_usuario,conversa.usuario.nombre,conversa.usuario.imagen,conversa.usuario.token_notificacion);

		    //get message list
			if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {
				this.getMsg();
			}
		}
	    
	}

	/*Setear el usuario seleccionado de la lista de conversas
	o de la lista de usarios(clientes/repartidores)*/
	setUsuario(chat_id, usuario_id, usuario_tipo, usuario_nombre, usuario_imagen, token_notificacion){
		
		//Datos del ususario (cliente/repartidor)
		localStorage.setItem('mouvers_chat_id', chat_id);
		localStorage.setItem('mouvers_usuario_id', usuario_id);
		localStorage.setItem('mouvers_usuario_tipo', usuario_tipo);
		localStorage.setItem('mouvers_usuario_nombre', usuario_nombre);
		localStorage.setItem('mouvers_usuario_imagen', usuario_imagen);
		localStorage.setItem('mouvers_usuario_token_notifi', token_notificacion);

	  	/*this.chat_id = chat_id;
	  	this.usuario_id = usuario_id;
	  	this.usuario_tipo = usuario_tipo;
	  	this.usuario_nombre = usuario_nombre;
	  	this.usuario_imagen = usuario_imagen;
	    this.token_notificacion = token_notificacion;*/

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
	}

	/*Setear el ultimo mensaje en la lista de conversaciones*/
	setUltimoMsg(msg){
		if (this.usuario_tipo == '2' ) {
			if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {
				for (var i = 0; i < this.conversationsCli.length; ++i) {
					if (this.conversationsCli[i].id == parseInt(this.chat_id)) {
						this.conversationsCli[i].ultimo_msg.msg = msg.msg;
						this.conversationsCli[i].ultimo_msg.created_at = msg.created_at;
					}
				}
			}
			else{
				this.addConversa(msg);
			}
			
		}
		else if (this.usuario_tipo == '3' ) {
			if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {
				for (var i = 0; i < this.conversationsRep.length; ++i) {
					if (this.conversationsRep[i].id == parseInt(this.chat_id)) {
						this.conversationsRep[i].ultimo_msg.msg = msg.msg;
						this.conversationsRep[i].ultimo_msg.created_at = msg.created_at;
					}
				}
			}
			else{
				this.addConversa(msg);
			}
			
		}

	}

  /*Cargar la lista de clientes o de repartidores*/
  getUsuariosCliRep(modal2, tipo) {

	if (tipo == 2) {
		var url_final = 'usuarios';
		this.titulo_tabla = 'Clientes';
	}
	else if (tipo == 3){
		var url_final = 'usuarios/repartidores/aux';
		this.titulo_tabla = 'Repartidores';
	}
    
    this.loading = true;
    this.http.get(this.rutaService.getRutaApi()+url_final+'?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data=data;

           this.productList = this.data.usuarios;
           this.filteredItems = this.productList;
           //console.log(this.productList);

           this.init();

           this.loading = false;

           this.open2(modal2);
           
         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);

           this.loading = false;

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);

                this.showToast('warning', 'Warning!', msg.error.error);
                //this.mostrar = false;
            }
            //sin usuarios
            else if(msg.status == 404){ 
                //alert(msg.error.error);
                this.showToast('info', 'Info!', msg.error.error);
            }
            

         }
       );
  }

  /*Tratamineto para el usuario(Cliente/Repartidor)
  seleccionado de la lista(tabla)*/
  selectUsuarioList (userSelecto){
  	console.log(userSelecto);

  	var chat_id : any;

  	if (userSelecto.tipo_usuario == 2) {
  		if (userSelecto.chat_cliente) {
  			chat_id =  userSelecto.chat_cliente.id;
  		}else{
  			chat_id = '';
  		}
  	}else if (userSelecto.tipo_usuario == 3) {
  		if (userSelecto.chat_repartidor) {
  			chat_id = userSelecto.chat_repartidor.id;
  		}else{
  			chat_id = '';
  		}
  	}

  	this.setUsuario(chat_id, userSelecto.id,
  		userSelecto.tipo_usuario, userSelecto.nombre,
  		userSelecto.imagen, userSelecto.token_notificacion);

  	//this.refreshChat();

  	//get message list
	if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {

		this.getMsg();

	}else{

		this.msgList = [];
	}
  	
  }

  addMsgEvent(data){

  	var obj = JSON.parse(data.obj);

  	let newMsg: ChatMessage = {
		  id: Date.now().toString(),
		  emisor_id: parseInt(obj.emisor.id),
		  userAvatar: obj.emisor.imagen,
		  receptor_id: parseInt(this.user.id),
		  created_at: Date.now(),
		  msg: data.contenido,
		  status: 1
		};

		/*Si tengo cargado el chat
		de la notificacion entrante 
		actualizo la caja de chat*/
		if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {
			if (obj.chat_id == parseInt(this.chat_id) &&
			  	obj.emisor.tipo_usuario == parseInt(this.usuario_tipo)) {
				this.msgList.push(newMsg);
				this.scrollToBottom();
			}
		}	

		/*Actulizar la lista de conversaciones*/
		if (obj.emisor.tipo_usuario == 2 ) {
			var actualizado = false;
			for (var i = 0; i < this.conversationsCli.length; ++i) {
				if (this.conversationsCli[i].id == obj.chat_id) {
					this.conversationsCli[i].ultimo_msg.msg = newMsg.msg;
					this.conversationsCli[i].ultimo_msg.created_at = newMsg.created_at;
					actualizado = true;
				}
			}

			if (!actualizado) {
				const aux: Conversation = {
					id: obj.chat_id,
					admin_id: parseInt(this.admin_id),
					usuario_id: obj.emisor.id,
					created_at: newMsg.created_at,
					updated_at: newMsg.created_at,
					ultimo_msg: {
					    id: Date.now(),
					    msg: newMsg.msg,
					    created_at: newMsg.created_at,
					},
					usuario: {
					    id: obj.emisor.id,
					    nombre: obj.emisor.nombre,
					    imagen: obj.emisor.imagen,
					    tipo_usuario: obj.emisor.tipo_usuario,
					    token_notificacion: obj.emisor.token_notificacion,
					},
				};


				this.conversationsCliService.agregarConversation(aux);

			}
			
			
		}
		else if (obj.emisor.tipo_usuario == 3 ) {
			var actualizado = false;
			for (var i = 0; i < this.conversationsRep.length; ++i) {
				if (this.conversationsRep[i].id == obj.chat_id) {
					this.conversationsRep[i].ultimo_msg.msg = newMsg.msg;
					this.conversationsRep[i].ultimo_msg.created_at = newMsg.created_at;
					actualizado = true;
				}
			}

			if (!actualizado) {
				const aux: Conversation = {
					id: obj.chat_id,
					admin_id: parseInt(this.admin_id),
					usuario_id: obj.emisor.id,
					created_at: newMsg.created_at,
					updated_at: newMsg.created_at,
					ultimo_msg: {
					    id: Date.now(),
					    msg: newMsg.msg,
					    created_at: newMsg.created_at,
					},
					usuario: {
					    id: obj.emisor.id,
					    nombre: obj.emisor.nombre,
					    imagen: obj.emisor.imagen,
					    tipo_usuario: obj.emisor.tipo_usuario,
					    token_notificacion: obj.emisor.token_notificacion,
					},
				};


				this.conversationsRepService.agregarConversation(aux);

			}
			
		}	
  }

  headerEvent(msg){

  	this.setUsuario(msg.chat_id, msg.emisor.id,
  		msg.emisor.tipo_usuario, msg.emisor.nombre,
  		msg.emisor.imagen, msg.emisor.token_notificacion);

  	//get message list
	if (this.chat_id != '' && this.chat_id != 'null' && this.chat_id) {

		this.getMsg();

	}
  }

  //Borrar de la lista de header al abrir un chat
  clearHeaderConversation(){
  	var aux =  {
            chat_id: parseInt(this.chat_id),
            emisor_id: parseInt(this.usuario_id),
            receptor_id: parseInt(this.admin_id),
            emisor: {
                id: parseInt(this.usuario_id),
                tipo_usuario: parseInt(this.usuario_tipo)
            }
        };

        //console.log(aux);

    this.headerService.clearConversationAux(aux);

  }

  //Borrar de la lista de header al borrar un chat
  clearHeaderConversation2(chat_id, usuario_id, admin_id, usuario_tipo){
  	var aux =  {
            chat_id: parseInt(this.chat_id),
            emisor_id: parseInt(this.usuario_id),
            receptor_id: parseInt(this.admin_id),
            emisor: {
                id: parseInt(this.usuario_id),
                tipo_usuario: parseInt(this.usuario_tipo)
            }
        };

        //console.log(aux);

    this.headerService.clearConversationAux(aux);

  }
  	//Actualizar los mensajes en la API a leidos (estado=2)
  	putLeer(){

		//Peticion a la tabla de mensajes de los clientes
		if (this.usuario_tipo == '2') {
			var url_final = 'clientes';
		}
		//Peticion a la tabla de mensajes de los repartidores
		else if (this.usuario_tipo == '3'){
			var url_final = 'repartidores';
		}

		var datos= {
			chat_id: parseInt(this.chat_id),
			receptor_id: parseInt(this.admin_id),
	        token: localStorage.getItem('mouvers_token'),
	      }

		this.http.put(this.rutaService.getRutaApi()+'chats/'+url_final+'/leer', datos)
	    .toPromise()
	    .then(
		data => {
			console.log(data);

		},
		msg => {
			console.log(msg);

			//token invalido/ausente o token expiro
             if(msg.status == 400 || msg.status == 401){ 
                  //alert(msg.error.error);
                  this.showToast('warning', 'Warning!', msg.error.error);
	              	setTimeout(()=>{
	                  this.router.navigateByUrl('/pagessimples/loginf');
	                },1000);
              }
			
		});
	}

  //----Tabla<
   titulo_tabla = '';
   filteredItems : any;
   pages : number = 4;
   pageSize : number = 5;
   pageNumber : number = 0;
   currentIndex : number = 1;
   items: any;
   pagesIndex : Array<number>;
   pageStart : number = 1;
   inputName : string = '';

   init(){
         this.currentIndex = 1;
         this.pageStart = 1;
         this.pages = 4;

         this.pageNumber = parseInt(""+ (this.filteredItems.length / this.pageSize));
         if(this.filteredItems.length % this.pageSize != 0){
            this.pageNumber ++;
         }
    
         if(this.pageNumber  < this.pages){
               this.pages =  this.pageNumber;
         }
       
         this.refreshItems();
         console.log("this.pageNumber :  "+this.pageNumber);
   }

   FilterByName(){
      this.filteredItems = [];
      if(this.inputName != ""){
            for (var i = 0; i < this.productList.length; ++i) {
              if (this.productList[i].nombre.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].email.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }/*else if (this.productList[i].ciudad.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].estado.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }*/else if (this.productList[i].telefono.indexOf(this.inputName)>=0) {
                 this.filteredItems.push(this.productList[i]);
              }
            }
      }else{
         this.filteredItems = this.productList;
      }
      console.log(this.filteredItems);
      this.init();
   }
   fillArray(): any{
      var obj = new Array();
      for(var index = this.pageStart; index< this.pageStart + this.pages; index ++) {
                  obj.push(index);
      }
      return obj;
   }
   refreshItems(){
       this.items = this.filteredItems.slice((this.currentIndex - 1)*this.pageSize, (this.currentIndex) * this.pageSize);
       this.pagesIndex =  this.fillArray();
   }
   prevPage(){
      if(this.currentIndex>1){
         this.currentIndex --;
      } 
      if(this.currentIndex < this.pageStart){
         this.pageStart = this.currentIndex;
      }
      this.refreshItems();
   }
   nextPage(){
      if(this.currentIndex < this.pageNumber){
            this.currentIndex ++;
      }
      if(this.currentIndex >= (this.pageStart + this.pages)){
         this.pageStart = this.currentIndex - this.pages + 1;
      }
 
      this.refreshItems();
   }
    setPage(index : number){
         this.currentIndex = index;
         this.refreshItems();
    }
  //----Tabla>


}
