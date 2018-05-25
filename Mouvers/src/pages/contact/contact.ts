import { Component } from '@angular/core';
import { NavController, App, AlertController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';
import { Facebook } from '@ionic-native/facebook';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { CartProvider } from '../../providers/cart/cart';
import { ChatSupportPage } from '../chat-support/chat-support';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

	public usuario: any;
	public datos: any;
	public datos2: any;
	public band_chatSupport: boolean = false;
	public chat_support = {
		admin_id: '',
		chat_id: '',
		token_notificacion: ''
	};

	constructor(public navCtrl: NavController, public app: App, public storage: StorageProvider, private facebook: Facebook, public cartProvider: CartProvider, private alertCtrl: AlertController,private rutebaseApi: RuteBaseProvider, public http: HttpClient) {
		this.usuario = this.storage.getObject('userMouver');
	}

	ionViewDidEnter() {  
		this.usuario = this.storage.getObject('userMouver');
		this.getIds();
  	}

  	getIds(){
	  	this.http.get(this.rutebaseApi.getRutaApi()+'chats/clientes/michat/'+this.usuario.id)
	    .toPromise()
	    .then(
	      data => {
	        this.datos = data;
	        this.chat_support.admin_id = this.datos.chat.admin_id;
	        this.chat_support.chat_id = this.datos.chat.id;
	        this.chat_support.token_notificacion = this.datos.admin[0].token_notificacion;
	        this.band_chatSupport = true;
	      },
	      msg => {
	      	if(msg.status == 404){ 
	          this.band_chatSupport = true;
	          this.chat_support.admin_id = msg.error.admin[0].id;
	          this.chat_support.token_notificacion = msg.error.admin[0].token_notificacion;
	        } else if(msg.status == 409){
	          this.band_chatSupport = false;
	        }
		});
	}

	salir(){
		this.facebook.getLoginStatus()
		.then(rta => {
		  if(rta.status == 'connected'){
		  	this.facebook.logout()
		    .then(rta => {
		      this.storage.set('tokenMouver','');
		      this.storage.setObject('userMouver', '');
		      this.storage.set('pedido_idMouver', '');
		      this.cartProvider.deleteCar();
		      this.app.getRootNav().setRoot(LoginPage);
		    })
		    .catch(error =>{
		      alert('error no conectado a facebook');
		      this.storage.set('tokenMouver','');
		      this.storage.setObject('userMouver', '');
		      this.storage.set('pedido_idMouver', '');
		      this.cartProvider.deleteCar();
		      this.app.getRootNav().setRoot(LoginPage);
		    });
		  } else {
		  	this.storage.set('tokenMouver','');
		  	this.storage.setObject('userMouver', '');
		  	this.storage.set('pedido_idMouver', '');
		  	this.cartProvider.deleteCar();
		  	this.app.getRootNav().setRoot(LoginPage);
		  }
		})
		.catch(error =>{
		  	this.storage.set('tokenMouver','');
		  	this.storage.setObject('userMouver', '');
		  	this.storage.set('pedido_idMouver', '');
		  	this.cartProvider.deleteCar();
		  	this.app.getRootNav().setRoot(LoginPage);
		});	
	}

	editProfile(){
		this.navCtrl.push(EditProfilePage);
	}

	presentConfirm() {
	    const alert = this.alertCtrl.create({
	      title: 'Cerrar Sesión',
	      message: '¿Desea cerrar sesión de Möuvers?',
	      buttons: [
	        {
	          text: 'No',
	          role: 'cancel',
	          handler: () => {
	            console.log('Cancel clicked');
	          }
	        },
	        {
	          text: 'Si',
	          handler: () => {
	          		this.salir();
	          }
	        }
	      ]
	    });
	    alert.present();
	}

	support(){
		if (this.band_chatSupport) {
			this.navCtrl.push(ChatSupportPage, {admin_id: this.chat_support.admin_id, chat_id: this.chat_support.chat_id, token_notificacion: this.chat_support.token_notificacion});
		} else {

		}
	}
}
