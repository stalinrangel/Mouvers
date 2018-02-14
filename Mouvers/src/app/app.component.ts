import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import {StorageProvider} from '../providers/storage/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
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
    });
  }
}
