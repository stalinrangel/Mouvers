import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { CalificationPage } from '../pages/calification/calification';
import { StorageProvider } from '../providers/storage/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: StorageProvider) {
    var item = this.storage.get('tokenMouver');
    if (item !== null && item !== "") {
      this.rootPage = TabsPage;
    } else {
      this.rootPage = LoginPage;
    }
    platform.ready().then(() => {
      statusBar.styleLightContent(); 
      splashScreen.hide();
      var that = this;
      var notificationOpenedCallback = function(jsonData) {
        if(jsonData.notification.payload.additionalData.accion==1){
          that.aceptOrder(jsonData.notification.payload.additionalData.pedido_id);       
        }
      };

      /*window["plugins"].OneSignal
      .startInit("a7bcda25-c861-45c6-9690-7f9ea76c92b7", "865044191010")
      .handleNotificationOpened(notificationOpenedCallback)
      .handleNotificationReceived(notificationOpenedCallback)
      .endInit();*/
    });
  }

  aceptOrder(pedido){
    this.storage.set('pedido_idMouver', pedido);
    this.nav.push(CalificationPage);
  }
}
