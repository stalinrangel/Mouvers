import { Component, OnInit, OnDestroy,  ElementRef, ViewChild } from '@angular/core';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../services/ruta-base/ruta-base.service';

import { FormBuilder, FormArray, FormGroup, Validators  } from '@angular/forms';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ComentariosService, ChatMessage, UserInfo } from "../../services/blog-services/comentarios-service/comentarios.service";
import { ListaService, Blog } from "../../services/blog-services/lista-service/lista.service";


import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { NbSidebarService } from '@nebular/theme';

import { ViewBlogEventService } from '../../services/eventos-services/view-blog-event-service/view-blog-event.service';
import { HeaderToBlogEventService } from '../../services/eventos-services/header-to-blog-event-service/header-to-blog-event.service';


@Component({
  selector: 'blogs-box',
  styleUrls: ['./blogs.component.scss'],
  templateUrl: './blogs.component.html',
})

export class BlogsComponent implements OnInit, OnDestroy{

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
	private dataBlogs:any;
	public loading = false;
	public loading2 = false;

	//Manejo del chat
	//@ViewChild(Content) contentM: Content;
	@ViewChild('scrollChat') chatContent: ElementRef;
	msgList: ChatMessage[] = [];
	user: UserInfo;
	editorMsg = '';
	showEmojiPicker = false;

	public usuario: any;
	public datos: any;
	public admin_id: string = '';
	public admin_imagen: string = '';
	public admin_nombre: string = '';
	public blog_id: string = '';
	public tema: string = '';
	public creador: string = '';
	public titulo_blog: string = '';

	public send_msg = {
	  	usuario_id: 0,
	  	msg: '',
	  	token: '',
	  	blog_id: ''
	};

	blogs: Blog[] = [];
  	blogs$: Observable<Blog[]>;
  	blogsSubscription: Subscription;

  	objAEliminar: any;
	eliminar_id: any;
	eliminar_nombre: any;

	newBlog = ''; 

	constructor( private sidebarService: NbSidebarService,
		   private modalService: NgbModal,
	       private toasterService: ToasterService,
	       private http: HttpClient,
	       private router: Router,
	       private rutaService: RutaBaseService,
	       public fb: FormBuilder,
	       private comentariosService: ComentariosService,
	       private listaService: ListaService,
	       private viewBlogEventService: ViewBlogEventService,
	       private headerToBlogEventService: HeaderToBlogEventService)
	{

		//Detectar evento nuevo blog
		this.viewBlogEventService.viewBlogData.subscribe(
	      (data: any) => {
	        //console.log(data); 
	        this.addBlogEvent(data);
	    });

	    //Detectar evento cargar blog de notificacion entrante
		this.headerToBlogEventService.headerToBlogData.subscribe(
	      (data: any) => {
	        //console.log(data); 
	        this.headerEvent(data);
	    });

		//Datos del admin
		this.admin_id = localStorage.getItem('mouvers_user_id');
		this.admin_imagen = localStorage.getItem('mouvers_user_imagen');
		this.admin_nombre = localStorage.getItem('mouvers_user_nombre');

	  	this.blog_id = localStorage.getItem('mouvers_blog_id');
	  	this.tema = localStorage.getItem('mouvers_tema');
	  	this.creador = localStorage.getItem('mouvers_creador');

	    this.comentariosService.getUserInfo(this.admin_id, this.admin_imagen)
	    .then((res) => {
	      this.user = res
	    });
	}


	ngOnInit() {

		this.toggleSidebar();
		
		//get message list
		if (this.blog_id != '' && this.blog_id != 'null' && this.blog_id) {
			//this.getMsg();
		}

		// Subscribe to received  new message events
		/*this.events.subscribe('chat:received', msg => {

		  this.pushNewMsg(msg);
		  console.log(msg)
		})*/

		this.blogs$ = this.listaService.getBlogs$();
    	this.blogsSubscription = this.blogs$.subscribe(blogs => this.blogs = blogs);
    	this.initListaBlogs();

	}

	ngOnDestroy() {
	   // acciones de destrucción
		localStorage.setItem('mouvers_blog_id', '');
		localStorage.setItem('mouvers_tema', '');
		localStorage.setItem('mouvers_creador', '');

		this.blogsSubscription.unsubscribe();

	 }

	initListaBlogs() {

      this.listaService.resetBlogs();

      this.loading2 = true;

      this.http.get(this.rutaService.getRutaApi()+'blogs?token='+localStorage.getItem('mouvers_token'))
         .toPromise()
         .then(
           data => { // Success
             //console.log(dataCli);

              this.dataBlogs=data;
              var blogs = this.dataBlogs.blogs;
                 
              for (var i = 0; i < blogs.length; ++i) {
               const aux: Blog = {
                    id: blogs[i].id,
                    tema: blogs[i].tema,
                    creador: blogs[i].creador,
                    created_at: blogs[i].created_at,
                    updated_at: blogs[i].updated_at,
                    count_msgs: blogs[i].count_msgs,
                    
                };

                this.listaService.agregarBlog(aux);
            }

             this.loading2 = false;

             console.log('Lista Blogs:');
             console.log(this.listaService.getBlogs());

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
              else if(msg.status == 404){ 
                  //alert(msg.error.error);
                  this.showToast('info', 'Info!', msg.error.error);
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

	//Abrir modal por defecto segunda configuracion
	open2(modal) {
		this.modalService.open(modal , { backdrop: 'static', container: 'nb-layout', keyboard: false});
	}

	getMsg() {
		this.loading = true;
		this.msgList = [];
	    return this.comentariosService.getMsgList(this.blog_id
	    	).subscribe(res => {
	        this.msgList = res;
	        this.loading = false;
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

		if (this.blog_id == '' || this.blog_id == 'null' || !this.blog_id){
			this.showToast('info', 'Info!', 'Debe seleccionar un blog.');
			return;	
		} 

		// Mock message
		const id = Date.now().toString();
		
		let newMsg: ChatMessage = {
		  id: Date.now().toString(),
		  usuario_id: parseInt(this.admin_id),
		  userAvatar: this.admin_imagen,
		  nameAvatar: this.admin_nombre,
		  created_at: Date.now(),
		  msg: this.editorMsg,
		  status: 1
		};

		this.pushNewMsg(newMsg);
		this.comentariosService.sendMsg(newMsg).then(() => {})
		this.sendMsgServer(this.editorMsg,id);
		this.editorMsg = '';
		//Setear el contador de mensajes
		 
	}

	sendMsgServer(msg,id){

		this.send_msg.usuario_id = parseInt(this.admin_id);
		this.send_msg.msg = msg;
		this.send_msg.blog_id = this.blog_id;
		this.send_msg.token = localStorage.getItem('mouvers_token');
		console.log(this.send_msg);

		this.http.post(this.rutaService.getRutaApi()+'mensajes/blogs', this.send_msg)
	    .toPromise()
	    .then(
		data => {
			console.log(data);
			this.datos = data;
			this.blog_id = this.datos.mensaje.blog_id;	

			this.listaService.updateCount(this.datos.mensaje.blog_id);

			localStorage.setItem('mouvers_blog_id', this.datos.mensaje.blog_id);
			
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
		const userId = parseInt(this.user.id);
		
		if (msg.usuario_id === userId ) {
		  this.msgList.push(msg);
		  console.log(this.msgList);
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
      this.eliminar_nombre = this.objAEliminar.tema;
    }

	deletChat(){
      console.log(this.objAEliminar);
      
      this.loading = true;

      var datos= {
        token: localStorage.getItem('mouvers_token')
      }

      this.http.delete(this.rutaService.getRutaApi()+'blogs/'+this.eliminar_id+'?token='+localStorage.getItem('mouvers_token'))
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

              localStorage.setItem('mouvers_blog_id', '');
              localStorage.setItem('mouvers_tema', '');
              localStorage.setItem('mouvers_creador', '');

	            if (this.blog_id != '' && this.blog_id != 'null' && this.blog_id) {
	              if (parseInt(this.blog_id) == this.eliminar_id ) {
	              	this.msgList = [];
	              	this.blog_id = '';
	              	this.tema = '';
	              	this.creador = '';
	              	this.titulo_blog = '';
	              }
	          	}

				this.listaService.deleteBlog(this.eliminar_id);

				/*var aux = this.blogs;

				this.blogs = [];

				for (var i = 0; i < aux.length; ++i) {
					if (this.eliminar_id != aux[i].id) {
						this.blogs.push(aux[i]);
					}
				}*/
				

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
                  //ir a login

                  this.showToast('warning', 'Warning!', msg.error.error);
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
		if (this.blog_id != '' && this.blog_id != 'null' && this.blog_id) {

			this.getMsg();

			this.initListaBlogs();
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

	/*Cargar los comentarios de un blog de la lista*/
	getChatOfConversa(blog) {

		if (blog.id != this.blog_id) {
		    this.setBlog(blog.id,blog.tema,blog.creador);

		    //get message list
			if (this.blog_id != '' && this.blog_id != 'null' && this.blog_id) {
				this.getMsg();
			}
		}
	    
	}

	/*Setear el blog seleccionado de la lista de blogs*/
	setBlog(blog_id, tema, creador){
		
		localStorage.setItem('mouvers_blog_id', blog_id);
		localStorage.setItem('mouvers_tema', tema);
		localStorage.setItem('mouvers_creador', creador);

	  	this.blog_id = localStorage.getItem('mouvers_blog_id');
	  	this.tema = localStorage.getItem('mouvers_tema');
	  	this.creador = localStorage.getItem('mouvers_creador');
	   
	}

	resetNewBlog() {	
		
		this.newBlog = '';
		
	}

	addBlog() {	
		
		//alert('Blog: '+this.newBlog.toUpperCase());
      
      this.loading = true;

      var datos= {
      	tema: this.newBlog.toUpperCase(),
      	creador: this.admin_nombre,
        token: localStorage.getItem('mouvers_token')
      }

      this.http.post(this.rutaService.getRutaApi()+'blogs', datos)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

              this.resetNewBlog();
              this.initListaBlogs();

				/*const aux: Blog = {
					id: this.data.blog.id,
					tema: this.data.tema,
					creador: this.data.creador,
					created_at: this.data.blog.created_at, 
					updated_at: this.data.blog.updated_at,
					count_msgs: 0,
				};

				//this.listaService.agregarBlog(aux);
				this.blogs.push(aux);*/

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
                  //ir a login

                  this.showToast('warning', 'Warning!', msg.error.error);
              }
              else { 
                  //alert(msg.error.error);
                  this.showToast('error', 'Erro!', msg.error.error);
              }

           }
         );

	}


  addBlogEvent(data){

  	var obj = JSON.parse(data.obj);

  	const aux: Blog = {
		id: obj.blog_id,
		tema: obj.tema,
		creador: obj.creador,
		created_at: obj.created_at, 
		updated_at: obj.created_at,
		count_msgs: 0,
	};

	this.listaService.agregarBlog(aux);
	//this.blogs.push(aux);

		
  }

  headerEvent(obj){
  	var obj = JSON.parse(obj);

  	this.setBlog(obj.blog_id,obj.tema,obj.creador);

    //get message list
	if (this.blog_id != '' && this.blog_id != 'null' && this.blog_id) {
		this.getMsg();
	}
  }



}
