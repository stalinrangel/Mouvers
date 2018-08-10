import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

// Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

import { ViewHeaderEventService } from '../../../services/eventos-services/view-header-event-service/view-header-event.service';
import { HeaderToChatEventService } from '../../../services/eventos-services/header-to-chat-event-service/header-to-chat-event.service';
import { HeaderToBlogEventService } from '../../../services/eventos-services/header-to-blog-event-service/header-to-blog-event.service';
import { HeaderToPedidosEventService } from '../../../services/eventos-services/header-to-pedidos-event-service/header-to-pedidos-event.service';

import { HeaderService } from '../../../services/header-service/header.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  //----Alertas---<
  config: ToasterConfig;

  positionAlert = 'toast-top-right';
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
   eventNotificationCli : any;

   conversationsCli = [];
   conversationsRep = [];
   notificationsCli = []; //Array para los pedidos sin repartidor y los nuevos blogs

   /*notificationsCli = [
     {mensaje: 'Un pedido necesita ser asignado desde el panel debido a que no se ubicó un motorizado', created_at:'2:00pm'},
     {mensaje: 'Carlos Pérez ha realizado un nuevo pedido', created_at:'1:00pm'}
   ]*/

   showHideMessage: boolean = true;
   showHideNotification: boolean = true;

   public data:any;
   public data2:any;
   public data3:any;
   public data4:any;
   public pedido:any;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private viewHeaderEventService: ViewHeaderEventService,
              private headerToChatEventService: HeaderToChatEventService,
              private headerToBlogEventService: HeaderToBlogEventService,
              private headerToPedidosEventService: HeaderToPedidosEventService,
              private headerService: HeaderService,
              private http: HttpClient,
              private rutaService: RutaBaseService,
              private toasterService: ToasterService) {

    //Detectar una nueva notificaion
    this.viewHeaderEventService.viewHeaderData.subscribe(
        (data: any) => {
          //console.log(data); 
          if (data.accion == '2') {
            this.newEventChat(data);
          }else if (data.accion == '4' || data.accion == '5' || data.accion == '6') {

            this.newEventNotificationCli(data);
          }
      });
  }

  ngOnInit() {
    /*this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);*/

      this.user.name = localStorage.getItem('mouvers_user_nombre');

      this.initConversationsCli();
      this.initConversationsRep();
      this.initNotificationsCli();

  }

  ngOnDestroy() {
    this.headerService.ressetConversations();
    this.headerService.ressetNotificationsCli();
   }

  /*newAlert() {
    this.showToastPermanente('info', 'Info!', 'Persistente');
   }
   newAlert2() {
    this.showToast('info', 'Info!', 'Timeout');
   }*/

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

  private showToastPermanente(type: string, title: string, body: string) {
      this.config = new ToasterConfig({
        positionClass: this.position,
        timeout: 0, /*persistente*/
        newestOnTop: this.isNewestOnTop,
        tapToDismiss: this.isHideOnClick,
        preventDuplicates: this.isDuplicatesPrevented,
        animation: this.animationType,
        limit: 20,
      });
      const toast: Toast = {
        type: type,
        title: title,
        body: body,
        timeout: 0,
        showCloseButton: this.isCloseButton,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.toasterService.popAsync(toast);
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
           this.data2=data;

           for (var i = 0; i < this.data2.msgs.length; i++) {
             this.headerService.pushConversation(this.data2.msgs[i]);
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

  getEventChat(){
    if (this.eventChat) {
      var obj = JSON.parse(this.eventChat.obj);
      var contenido = this.eventChat.contenido;
      this.eventChat = null;
      this.newMensaje(obj, contenido);
    }
  }

  initNotificationsCli(){
    this.headerService.ressetNotificationsCli();
    this.http.get(this.rutaService.getRutaApi()+'pedidos/por/asignar?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data3=data;
           var pedido=null;

           for (var i = 0; i < this.data3.porAsignar.length; i++) {

             pedido = {
                  id: this.data3.porAsignar[i].id,
                  contenido: "El pedido M00"+this.data3.porAsignar[i].id+" necesita un repartidor.",
                  created_at: this.data3.porAsignar[i].created_at,
                  icono: "nb-alert",
                  accion: "6", 
                  tema: "",
                  creador: "", 
              };

             this.headerService.pushNotificationCli(pedido);
           }

           setTimeout(()=>{
              this.notificationsCli = this.headerService.getNotificationsCli();
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

  //agregar notificacion
  newNotificationCli(obj, contenido, accion, pedido_id){

    /*Nota: si accion=4 tomo el id del blog
        si accion=5 o 6 tomo pedido_id*/
    var id = 0;
    var tema = "";
    var creador = "";
    var icono = "nb-alert";

    //Nuevo blog
    if (accion == '4') {
      id = parseInt(obj.blog_id);
      tema = obj.tema;
      creador = obj.creador;
      icono = "fa fa-book";
    }
    //Nuevo pedido
    else if (accion == '5'){
      id = parseInt(pedido_id);
      icono = "nb-compose";
    }
    //Pedido sin repartidor
    else if (accion == '6'){
      id = parseInt(pedido_id);
      icono = "nb-alert";
    }

    var notification = {
            id: id,
            contenido: contenido,
            created_at: obj.created_at,
            icono: icono,
            accion: "6", 
            tema: tema,
            creador: creador,
        };

    this.headerService.addNotificationCli(notification);
  }

  /*//Funcion de prueba
  i = 1;
  newNotificationCli2(){
    this.i +=1; 

    var notification = {
            id: this.i,
            contenido: "Prueba "+this.i,
            created_at: "created_at",
            icono: "fa fa-book",
            accion: "4", 
            tema: "tema",
            creador: "creador",
        };

    this.headerService.addNotificationCli(notification);

  }*/

  //leer (eliminar) mgs de la lista
  leerNotification(notification, indice){

    if (notification.accion == '4') {

      if (this.router.url == '/pages/blogs') {
        // emitir obj al blog para cargarlo
        this.headerToBlogEventService.headerToBlogData.emit(notification);
      }else{

        var obj = JSON.parse(this.eventBlog);
        localStorage.setItem('mouvers_blog_id', obj.blog_id);
        localStorage.setItem('mouvers_tema', obj.tema);
        localStorage.setItem('mouvers_creador', obj.creador);

        this.router.navigateByUrl('/pages/blogs');
      }
      this.headerService.clearNotificationCli(indice);

    }else if (notification.accion == '5' || notification.accion == '6') {
      
      this.http.get(this.rutaService.getRutaApi()+'pedidos/info/basica/'+notification.id+'?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data4=data;
           var pedido =  this.data4.pedido;
           this.tratarPedido(pedido, indice);
            
           
         },
         msg => { // Error
           console.log(msg);
           
           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);

                console.log(msg.error.error);
                //alert(msg.error.error);
                this.salir();
                //this.router.navigateByUrl('/pagessimples/loginf');
                this.showToast('warning', 'Warning!', msg.error.error);
                setTimeout(()=>{
                  this.salir();
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

  }

  //Tratar pedido en base a su estado
  tratarPedido(pedido, indice){
    //pedido en curso
    if (pedido.estado == 1 || pedido.estado == 2 || pedido.estado == 3) {

      localStorage.setItem('mouvers_pedido_id', pedido.id);

      if (this.router.url == '/pages/pedidos/encurso') {
        // emitir event para cargar pedido_id
        this.headerToPedidosEventService.headerToPedidosData.emit(pedido.id);
      }else{

        this.router.navigateByUrl('/pages/pedidos/encurso');
      }

    }
    //pedido finalizado
    else if(pedido.estado == 4){

      localStorage.setItem('mouvers_pedido_id', pedido.id);

      if (this.router.url == '/pages/pedidos/finalizados') {
        // emitir event para cargar pedido_id
        this.headerToPedidosEventService.headerToPedidosData.emit(pedido.id);
      }else{

        this.router.navigateByUrl('/pages/pedidos/finalizados');
      }
      //this.headerService.clearNotificationCli(indice);

    }
  }

  newEventNotificationCli(data){

    if (data.accion == '5') {
      this.showToast('info', 'Info!', data.contenido);
    }else if (data.accion == '6'){
      this.showToastPermanente('warning', 'Warning!', data.contenido);
    }

    this.eventNotificationCli = data;
    this.getEventNotificationCli();
  }

  getEventNotificationCli(){

    if (this.eventNotificationCli) {

      var obj = JSON.parse(this.eventNotificationCli.obj);
      var contenido = this.eventNotificationCli.contenido;
      var accion = this.eventNotificationCli.accion;
      var pedido_id = this.eventNotificationCli.pedido_id;

      this.eventNotificationCli = null;
      this.newNotificationCli(obj, contenido, accion, pedido_id);

    }

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
