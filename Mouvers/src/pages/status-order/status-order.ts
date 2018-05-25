import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController, Loading, ToastController } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { ListCartPage } from '../list-cart/list-cart';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider} from '../../providers/storage/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-status-order',
  templateUrl: 'status-order.html',
})
export class StatusOrderPage {

	items: any;
	itemsInCart: number;
	datos: any;
	repartidor = {
		usuario: {
			imagen: 'assets/imgs/user-white.png',
			telefono: ''
		}
	};

	constructor(public navCtrl: NavController, public storage: StorageProvider, public navParams: NavParams, public cartProvider: CartProvider, public http: HttpClient, public rutebaseAPI: RuteBaseProvider, public app: App, private toastCtrl: ToastController) {
		this.items = navParams.get('details');
		this.getRepartidor(this.items.repartidor_id);
	}

	ionViewWillEnter() {
		this.itemsInCart = this.cartProvider.getCartCount();
	}

	gotoCart(){
		this.navCtrl.push(ListCartPage);
	}

	getRepartidor(id){
		if (id != null) {
			this.http.get(this.rutebaseAPI.getRutaApi()+'repartidores/'+id+'?token='+this.storage.get('tokenMouver'))
		    .toPromise()
		    .then(
		      data => {
		        this.datos = data;
		        this.repartidor = this.datos.repartidor;
		      },
		      msg => {
		        if(msg.status == 400 || msg.status == 401){ 
                	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                	this.app.getRootNav().setRoot(LoginPage);
            	}
		    });
		}
	}

	presentToast(text) {
		let toast = this.toastCtrl.create({
		  message: text,
		  duration: 3000,
		  position: 'top'
		});

		toast.onDidDismiss(() => {
		  console.log('Dismissed toast');
		});

		toast.present();
	}

}
