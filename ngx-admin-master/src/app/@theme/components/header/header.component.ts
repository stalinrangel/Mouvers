import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

// Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

import { ViewHeaderEventService } from '../../../services/eventos-services/view-header-event-service/view-header-event.service';
import { HeaderToChatEventService } from '../../../services/eventos-services/header-to-chat-event-service/header-to-chat-event.service';
import { HeaderToBlogEventService } from '../../../services/eventos-services/header-to-blog-event-service/header-to-blog-event.service';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


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

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private viewHeaderEventService: ViewHeaderEventService,
              private headerToChatEventService: HeaderToChatEventService,
              private headerToBlogEventService: HeaderToBlogEventService) {

    //Detectar una nueva notificaion
    this.viewHeaderEventService.viewHeaderData.subscribe(
        (data: any) => {
          //console.log(data); 
          if (data.accion == '2') {
            this.newEventChat(data.obj);
          }else if (data.accion == '4') {
            this.newEventBlog(data.obj);
          }
      });
  }

  ngOnInit() {
    /*this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);*/

      this.user.name = localStorage.getItem('mouvers_user_nombre');
  }

  newEventChat(obj){
    this.iconChats = 'fa fa-envelope';
    this.eventChat = obj;
  }

  newEventBlog(obj){
    this.iconBlogs = 'fa fa-bell';
    this.eventBlog = obj;
  }

  getEventChat(){
    if (this.eventChat) {
      if (this.router.url == '/pages/chat-box') {
        // emitir obj al chat para cargarlo
        this.headerToChatEventService.headerToChatData.emit(this.eventChat);
      }else{

          var obj = JSON.parse(this.eventChat);
          localStorage.setItem('mouvers_chat_id', obj.chat_id);
          localStorage.setItem('mouvers_usuario_id', obj.emisor.id);
          localStorage.setItem('mouvers_usuario_tipo', obj.emisor.tipo_usuario);
          localStorage.setItem('mouvers_usuario_nombre', obj.emisor.nombre);
          localStorage.setItem('mouvers_usuario_imagen', obj.emisor.imagen);
          localStorage.setItem('mouvers_usuario_token_notifi', obj.emisor.token_notificacion);

          this.router.navigateByUrl('/pages/chat-box');
      }
      this.iconChats = 'nb-email';
      this.eventChat = null;
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
