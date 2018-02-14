import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public app: App) {

  }

  salir(){
  	this.app.getRootNav().setRoot(LoginPage);
  }

}
