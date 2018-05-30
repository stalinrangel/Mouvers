import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { CalificationPage } from '../pages/calification/calification';
import { StorageProvider } from '../providers/storage/storage';
import { ChatSupportPage } from '../pages/chat-support/chat-support';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: StorageProvider, public events: Events) {
    var item = this.storage.get('tokenMouver');
    if (item !== null && item !== "") {
      this.rootPage = TabsPage;
    } else {
      this.rootPage = LoginPage;
    }
    platform.ready().then(() => {
      statusBar.styleLightContent(); 
      splashScreen.hide();

      let OneSignal = window["plugins"].OneSignal;
      var that = this;

      OneSignal
      .startInit("a7bcda25-c861-45c6-9690-7f9ea76c92b7", "865044191010")
      .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
      .handleNotificationOpened(function(jsonData) {
        /*if(jsonData.notification.payload.additionalData.accion==1){
          that.aceptOrder(jsonData.notification.payload.additionalData.pedido_id);       
        }*/
        //let view = that.nav.getActive();
        //alert(view.component);
        //that.nav.push(ChatSupportPage, {admin_id: 1, chat_id: 1, token_notificacion:'dwidojowdjo'});
        alert(JSON.stringify(jsonData));
      })
      .handleNotificationReceived(function(jsonData) {
        /*if(jsonData.notification.payload.additionalData.accion==1){
          that.aceptOrder(jsonData.notification.payload.additionalData.pedido_id);       
        }*/
        alert(JSON.stringify(jsonData));

        /*const mockMsg = {
          id: Date.now().toString(),
          emisor_id: 2329382,
          userAvatar: 'assets/imgs/male-use.png',
          receptor_id: 232323,
          created_at: Date.now(),
          msg: jsonData.payload.additionalData.contenido,
          status: 2
        };
        that.events.publish('chat:received', mockMsg, Date.now())*/
      })
      .endInit();
    });
  }

  aceptOrder(pedido){
    this.storage.set('pedido_idMouver', pedido);
    this.nav.push(CalificationPage);
  }
}
