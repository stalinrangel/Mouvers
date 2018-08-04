import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

// Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

import { ViewHeaderEventService } from '../../../services/eventos-services/view-header-event-service/view-header-event.service';
import { HeaderToChatEventService } from '../../../services/eventos-services/header-to-chat-event-service/header-to-chat-event.service';
import { HeaderToBlogEventService } from '../../../services/eventos-services/header-to-blog-event-service/header-to-blog-event.service';

import { HeaderService } from '../../../services/header-service/header.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {


  @Input() position = 'normal';

  user = { name: '', picture: 'assets/images/user.png' };

  /*userMenu = [{ title: 'Profile' }, { title: 'Log out' }];*/
   userMenu = [{ title: 'Log out' }];
   menu = [{ title: 'Profile' }, { title: 'Log out' }];

   items = [{ title: 'Profile' }, { title: 'Log out' }];

   eventChat : any;
   eventBlog : any;
   iconChats = 'nb-email';
   iconBlogs = 'nb-notifications';

   conversationsCli = [];
   conversationsRep = [];

   notificationsCli = [
     {mensaje: 'Un pedido necesita ser asignado desde el panel debido a que no se ubicó un motorizado', created_at:'2:00pm'},
     {mensaje: 'Carlos Pérez ha realizado un nuevo pedido', created_at:'1:00pm'}
   ]

   showHideMessage: boolean = true;
   showHideNotification: boolean = true;

   public data:any;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private viewHeaderEventService: ViewHeaderEventService,
              private headerToChatEventService: HeaderToChatEventService,
              private headerToBlogEventService: HeaderToBlogEventService,
              private headerService: HeaderService,
              private http: HttpClient,
              private rutaService: RutaBaseService) {

    //Detectar una nueva notificaion
    this.viewHeaderEventService.viewHeaderData.subscribe(
        (data: any) => {
          //console.log(data); 
          if (data.accion == '2') {
            this.newEventChat(data);
          }else if (data.accion == '4') {
            this.newEventBlog(data.obj);
          }
      });
  }

  ngOnInit() {
    /*this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);*/

      this.user.name = localStorage.getItem('mouvers_user_nombre');

      this.initConversationsCli();
      this.initConversationsRep();

  }

  ngOnDestroy() {
    this.headerService.ressetConversations();
   }

  initConversationsCli(){
    this.headerService.ressetConversationsCli();
    this.http.get(this.rutaService.getRutaApi()+'chats/sinleer/clientes/'+localStorage.getItem('mouvers_user_id')+'?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data=data;

           for (var i = 0; i < this.data.msgs.length; i++) {
             this.headerService.pushConversation(this.data.msgs[i]);
           }

           setTimeout(()=>{
              this.conversationsCli = this.headerService.getConversationsCli();
            },500);

           
         },
         msg => { // Error
           console.log(msg);
           
           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);

                console.log(msg.error.error);
                
            }
            
         }
       );
  }

  initConversationsRep(){
    this.headerService.ressetConversationsRep();
    this.http.get(this.rutaService.getRutaApi()+'chats/sinleer/repartidores/'+localStorage.getItem('mouvers_user_id')+'?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data=data;

           for (var i = 0; i < this.data.msgs.length; i++) {
             this.headerService.pushConversation(this.data.msgs[i]);
           }

           setTimeout(()=>{
              this.conversationsRep = this.headerService.getConversationsRep();
            },500);

           
         },
         msg => { // Error
           console.log(msg);
           
           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);

                console.log(msg.error.error);
                
            }
            
         }
       );
  }

  //agregar mgs de una notificacion
  newMensaje(obj, contenido){
    var mensaje = {
            id: obj.msg.id,
            msg: contenido,
            estado: obj.msg.estado,
            chat_id: obj.msg.chat_id,
            emisor_id: obj.msg.emisor_id,
            receptor_id: obj.msg.receptor_id,
            created_at: obj.msg.created_at,
            emisor: {
                id: obj.emisor.id,
                nombre: obj.emisor.nombre,
                imagen: obj.emisor.imagen,
                tipo_usuario: obj.emisor.tipo_usuario,
                token_notificacion: obj.emisor.token_notificacion
            }
        };

    this.headerService.addConversation(mensaje);
  }

  /*//Funcion de prueba
  i = 1;
  newMensaje2(){
    this.i +=1; 
    var mensaje = {
            id: 17,
            msg: "xxx"+this.i,
            estado: 1,
            chat_id: 8,
            emisor_id: 5,
            receptor_id: 1,
            created_at: "2018-08-02 06:17:16",
            emisor: {
                id: 5,
                nombre: "cliente3",
                imagen: "assets/images/lee.png",
                tipo_usuario: 2,
                token_notificacion: null
            }
        };

    this.headerService.addConversation(mensaje);
  }*/

  //leer (eliminar) mgs de la lista
  leerMsg(msg, indice){

    if (this.router.url == '/pages/chat-box') {
      // emitir obj al chat para cargarlo
      this.headerToChatEventService.headerToChatData.emit(msg);
    }else{

        localStorage.setItem('mouvers_chat_id', msg.chat_id);
        localStorage.setItem('mouvers_usuario_id', msg.emisor.id);
        localStorage.setItem('mouvers_usuario_tipo', msg.emisor.tipo_usuario);
        localStorage.setItem('mouvers_usuario_nombre', msg.emisor.nombre);
        localStorage.setItem('mouvers_usuario_imagen', msg.emisor.imagen);
        localStorage.setItem('mouvers_usuario_token_notifi', msg.emisor.token_notificacion);

        this.router.navigateByUrl('/pages/chat-box');
    }
    this.headerService.clearConversation(msg, indice);

  }

  //redirigir a la vista de chats sino estoy en ella
  verTodos(){

    if (this.router.url != '/pages/chat-box') {
      this.router.navigateByUrl('/pages/chat-box');
    }

  }

  newEventChat(data){
    //this.iconChats = 'fa fa-envelope';
    this.eventChat = data;
    this.getEventChat();
  }

  newEventBlog(obj){
    //this.iconBlogs = 'fa fa-bell';
    this.eventBlog = obj;
  }

  getEventChat(){
    if (this.eventChat) {
      var obj = JSON.parse(this.eventChat.obj);
      var contenido = this.eventChat.contenido;
      this.eventChat = null;
      this.newMensaje(obj, contenido);
    }
  }

  getEventBlog(){
    if (this.eventBlog) {
      if (this.router.url == '/pages/blogs') {
        // emitir obj al blog para cargarlo
        this.headerToBlogEventService.headerToBlogData.emit(this.eventBlog);
      }else{

        var obj = JSON.parse(this.eventBlog);
        localStorage.setItem('mouvers_blog_id', obj.blog_id);
        localStorage.setItem('mouvers_tema', obj.tema);
        localStorage.setItem('mouvers_creador', obj.creador);

        this.router.navigateByUrl('/pages/blogs');
      }
    }
    this.iconBlogs = 'nb-notifications',
    this.eventBlog = null;
  }

  changeShowMessage(){
    this.showHideMessage = !this.showHideMessage;
    this.showHideNotification = true;
  }

  changeShowNotification(){
    this.showHideNotification = !this.showHideNotification;
    this.showHideMessage = true;
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    //this.menuService.navigateHome();
    this.router.navigateByUrl('/pages');
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  onMenuClick($event){
    if ($event.title == 'Log out') {
      this.salir();
    }

    
  }

  salir() {
    localStorage.removeItem('mouvers_token');
    localStorage.removeItem('mouvers_user_id');
    localStorage.removeItem('mouvers_user_nombre');
    localStorage.removeItem('mouvers_user_tipo');

    this.router.navigateByUrl('/pagessimples/loginf');
  }
}
