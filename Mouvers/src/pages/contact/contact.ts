import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import {StorageProvider} from '../../providers/storage/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

	usuario: any;

	constructor(public navCtrl: NavController, public app: App, public storage: StorageProvider) {
		this.usuario = this.storage.getObject('userMouver');
		console.log(this.usuario);
	}

  salir(){
  	this.app.getRootNav().setRoot(LoginPage);
  }

}
