/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Mis imports
import { RutaBaseService } from './services/ruta-base/ruta-base.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule, ANIMATION_TYPES  } from 'ngx-loading';

import { AgmCoreModule } from '@agm/core';

import { ChatService } from './services/chat-service/chat.service';
import { ConversationsCliService } from './services/conversationsCli-service/conversations-cli.service';
import { ConversationsRepService } from './services/conversationsRep-service/conversations-rep.service';

import { ComentariosService } from './services/blog-services/comentarios-service/comentarios.service';
import { ListaService } from './services/blog-services/lista-service/lista.service';

import { ViewChatEventService } from './services/eventos-services/view-chat-event-service/view-chat-event.service';
import { ViewBlogEventService } from './services/eventos-services/view-blog-event-service/view-blog-event.service';
import { ViewHeaderEventService } from './services/eventos-services/view-header-event-service/view-header-event.service';
import { HeaderToChatEventService } from './services/eventos-services/header-to-chat-event-service/header-to-chat-event.service';
import { HeaderToBlogEventService } from './services/eventos-services/header-to-blog-event-service/header-to-blog-event.service';
import { HeaderToPedidosEventService } from './services/eventos-services/header-to-pedidos-event-service/header-to-pedidos-event.service';

import { HeaderService } from './services/header-service/header.service';

import { ToasterModule } from 'angular2-toaster';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ToasterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCr8zuLtOO7IoK_rC948rLcqyqsIaZOouY',
      libraries: ["places"]
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    LoadingModule.forRoot({
        animationType: ANIMATION_TYPES.wanderingCubes,
        backdropBackgroundColour: 'rgba(0,0,0,0.7)', 
        backdropBorderRadius: '4px',
        primaryColour: '#ffffff', 
        secondaryColour: '#ffffff', 
        tertiaryColour: '#ffffff',
        fullScreenBackdrop: true
    })

  ],
  bootstrap: [AppComponent],
  providers: [
    HeaderService,
    HeaderToPedidosEventService,
    HeaderToBlogEventService,
    HeaderToChatEventService,
    ViewHeaderEventService,
    ViewBlogEventService,
    ViewChatEventService,
    ListaService,
    ComentariosService,
    ConversationsRepService,
    ConversationsCliService,
    ChatService,
    RutaBaseService,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
