/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from './services/ruta-base/ruta-base.service';

import { ViewChatEventService } from './services/eventos-services/view-chat-event-service/view-chat-event.service';
import { ViewBlogEventService } from './services/eventos-services/view-blog-event-service/view-blog-event.service';
import { ViewHeaderEventService } from './services/eventos-services/view-header-event-service/view-header-event.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics:AnalyticsService,
  			 private router: Router,
			 private route: ActivatedRoute,
			 private http: HttpClient,
			 private rutaService: RutaBaseService,
			 private viewChatEventService: ViewChatEventService,
			 private viewBlogEventService: ViewBlogEventService,
			 private viewHeaderEventService: ViewHeaderEventService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();

    	//Set memoria para los chats
    	localStorage.setItem('mouvers_chat_id', '');
		localStorage.setItem('mouvers_usuario_id', '');
		localStorage.setItem('mouvers_usuario_tipo', '');
		localStorage.setItem('mouvers_usuario_nombre', '');
		localStorage.setItem('mouvers_usuario_imagen', '');
		localStorage.setItem('mouvers_usuario_token_notifi', '');

		//Set memoria para los blogs
		localStorage.setItem('mouvers_blog_id', '');
		localStorage.setItem('mouvers_tema', '');
		localStorage.setItem('mouvers_creador', '');

		let OneSignal = window['OneSignal'] || [];
		var that = this;
    	
    	//Subscripcion a las notificaciones
	    OneSignal.push(["init", {
	      appId: "a75f81f0-b531-45c1-b7bf-fc41a11191b9",
	      autoRegister: false, // Set to true to automatically prompt visitors
	      subdomainName: 'https://mouvers.OS.TC',
	      allowLocalhostAsSecureOrigin: true,

	      httpPermissionRequest: {
	        enable: true,
	        modalTitle: 'Mouvers',
	        modalMessage: 'Gracias por suscribirse a las notificaciones!',
	        modalButtonText:'OK'

	      },
	      welcomeNotification:{
	        "title": "Mouvers",
	        "message": "Gracias por suscribirse a las notificaciones!"
	      },
	      notifyButton: {
	          	/* Your other notify button settings here ... */
		        enable: true,
		        displayPredicate: function() {
		            return OneSignal.isPushNotificationsEnabled()
		                .then(function(isPushEnabled) {
		                    /* The user is subscribed, so we want to return "false" to hide the notify button */
		                    return !isPushEnabled;
		                });
		        }, 
	      }
	    }]);
	    console.log('OneSignal Initialized');
	    
    	/*OneSignal.push(function () {
	      console.log('Register For Push');
	      OneSignal.push(["registerForPushNotifications"])
	    });*/

	    
	    OneSignal.push(function () {
	      // Occurs when the user's subscription changes to a new value.
	      OneSignal.on('subscriptionChange', function (isSubscribed) {
	        console.log("The user's subscription state is now:", isSubscribed);
	        OneSignal.getUserId().then(function (userId) {
	          console.log("User ID is", userId);

	          /*Actualiza el token_notificacion en memoria y en bd
	          cuando un usuairo se suscribe a las notificaciones*/
	          localStorage.setItem('mouvers_token_notificacion', userId);

	          var id = localStorage.getItem('mouvers_user_id');
	          var token = localStorage.getItem('mouvers_token');

	          if (id && token && id != '' && token != '' && userId && userId != '') {
	          	var datos = {
		          token: token,
		          token_notificacion: userId, 
		        };

		        that.http.put(that.rutaService.getRutaApi()+'mouversAPI/public/usuarios/'+id, datos)
		        .toPromise()
		        .then(
		        data => {
		        	console.log(data);
		        },
		        msg => {
		        	console.log(msg);    
		        });
	          }
	        });
	      });
	    });
	    
	    OneSignal.on('notificationDisplay', function (event) {

	    	/*
		  {
		      "id": "ce31de29-e1b0-4961-99ee-080644677cd7",
		      "heading": "OneSignal Test Message",
		      "content": "This is an example notification.",
		      "url": "https://onesignal.com?_osp=do_not_open",
		      "icon": "https://onesignal.com/images/notification_logo.png"
		  }
		  */

			//console.warn('OneSignal notification displayed:', event);
			console.log("OneSignal notification displayed:");
			console.log(event);

			//registrar en BD la notificacion detectada
			/*var error = {
	          data: JSON.stringify(event)
	        };

	        that.http.post(that.rutaService.getRutaApi()+'mouversAPI/public/error', error)
	        .toPromise()
	        .then(
	        data => {
	          
	        },
	        msg => {
	            
	        });*/

		  
		  	if (event.data.accion == '2') {
		  		
		  		//var obj = JSON.parse(event.data.obj);

		  		/*Si estoy en el chat y tengo cargador el
		  		chat de la notificacion entrante*/
		  		if (that.router.url == '/pages/chat-box') {
		  			
		  			console.log('Actualizar header, chat y lista de conversaciones');
		  			that.viewChatEventService.viewChatData.emit(event.data);
		  			that.viewHeaderEventService.viewHeaderData.emit(event.data);

		  		}
		  		/*Si no estoy en el chat*/
		  		else if(that.router.url != '/pages/chat-box'){

			    	/*Setear en el header la alerta con los valores
			    	de la notificacaion entrante*/
			    	console.log('Setear solo el header chat');
			    	that.viewHeaderEventService.viewHeaderData.emit(event.data);

		  		}
			    
		  	}
		  	else if (event.data.accion == '4'){

		  		//var obj = JSON.parse(event.data.obj);

		  		/*Si estoy en el chat y tengo cargador el
		  		chat de la notificacion entrante*/
		  		if (that.router.url == '/pages/blogs') {
		  			
		  			console.log('Actualizar header y lista de blogs');
		  			that.viewBlogEventService.viewBlogData.emit(event.data);
		  			that.viewHeaderEventService.viewHeaderData.emit(event.data);

		  		}
		  		/*Si no estoy en el chat*/
		  		else if(that.router.url != '/pages/blogs'){

			    	/*Setear en el header la alerta con los valores
			    	de la notificacaion entrante*/
			    	console.log('Setear solo el header blog');
			    	that.viewHeaderEventService.viewHeaderData.emit(event.data);

		  		}
		  	}

		});

		/*OneSignal.push(["addListenerForNotificationOpened", function(data) {
			console.log("Received NotificationOpened:");
			console.log(data);

			if (data.accion == '2') {
				this.router.navigateByUrl('/pages/chat-box');
			}
			else if (data.accion == '4') {
				this.router.navigateByUrl('/pages/blogs');
			}

		}]);*/
  }
}
