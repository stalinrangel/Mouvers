import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

// Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

import { ConversationsService, Conversation } from "../../../services/conversations-service/conversations.service";

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user = { name: '', picture: 'assets/images/user.png' };

  /*userMenu = [{ title: 'Profile' }, { title: 'Log out' }];*/
   userMenu = [{ title: 'Log out' }, { title: 'print' }, { title: 'add' }];
   menu = [{ title: 'Profile' }, { title: 'Log out' }];

   items = [{ title: 'Profile' }, { title: 'Log out' }];

   conversations: Conversation[] = [];
   conversations$: Observable<Conversation[]>;
   private data:any;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private http: HttpClient,
              private rutaService: RutaBaseService,
              private conversationsService: ConversationsService) {
  }

  ngOnInit() {
    /*this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);*/

      this.user.name = localStorage.getItem('mouvers_user_nombre');

      this.conversations$ = this.conversationsService.getConversationsClientes$();
      this.conversations$.subscribe(conversations => this.conversations = conversations);

      this.initConversationsClientes();
  }

  initConversationsClientes() {

    //this.loading = true;

    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/chats/clientes?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           //console.log(data);

            this.data=data;
            var chats = this.data.chats;
               
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

              this.conversationsService.agregarConversation(aux);
          }

           //this.loading = false;

           //console.log(this.conversations);
           console.log(this.conversationsService.getConversas());

         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);

           //this.loading = false;

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                alert(msg.error.error);
                //this.showToast('warning', 'Warning!', msg.error.error);
            }

            
         }
       );
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

    if ($event.title == 'print') {
      //console.log(this.conversationsService.getConversas());
      console.log(this.conversations);
    }

    if ($event.title == 'add') {
      //console.log(this.conversationsService.getConversas());
      this.addConversa();
    }
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

  salir() {
    localStorage.removeItem('mouvers_token');
    localStorage.removeItem('mouvers_user_id');
    localStorage.removeItem('mouvers_user_nombre');
    localStorage.removeItem('mouvers_user_tipo');

    this.router.navigateByUrl('/pagessimples/loginf');
  }
}
