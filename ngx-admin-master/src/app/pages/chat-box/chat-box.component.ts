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
	public admin_id = localStorage.getItem('mouvers_user_id');

	//Datos de la persona(cliente-repartidor) seleccionada para ver el chat
	public chat_id = localStorage.getItem('mouvers_chat_id');
	public chat_nombre = localStorage.getItem('mouvers_chat_nombre');
	public chat_tipo_usuario = localStorage.getItem('mouvers_chat_tipo_usuario');

	public chat = [];
	public msg:any;

	constructor( private modalService: NgbModal,
	       private toasterService: ToasterService,
	       private http: HttpClient,
	       private router: Router,
	       private rutaService: RutaBaseService,
	       public fb: FormBuilder)
	{


	}


	ngOnInit() {

		//Peticion a la tabla de mensajes de los clientes
		if (this.chat_tipo_usuario == '2') {
			var url_final = 'cliente?admin_id='+this.admin_id+'&cliente_id='+this.chat_id;
		}
		//Peticion a la tabla de mensajes de los repartidores
		else{
			var url_final = 'repartidor?admin_id='+this.admin_id+'&repartidor_id='+this.chat_id;
		}

		this.loading = true;
		this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/mensajes/'+url_final+'&token='+localStorage.getItem('mouvers_token'))
		   .toPromise()
		   .then(
		     data => { // Success
		       console.log(data);
		       this.data=data;
		       this.chat=this.data.chat;

		       this.loading = false;

		       this.leerMensajes(this.admin_id, this.chat_id);

		     },
		     msg => { // Error
		       console.log(msg);
		       console.log(msg.error.error);

		       this.loading = false;

		       //token invalido/ausente o token expiro
		       if(msg.status == 400 || msg.status == 401){ 
		            //alert(msg.error.error);
		            this.showToast('warning', 'Warning!', msg.error.error);
		        }
		        //sin usuarios
		        else if(msg.status == 404){ 
		            //alert(msg.error.error);
		            this.showToast('info', 'Info!', msg.error.error);
		        }
		        

		     }
		   );
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

}
