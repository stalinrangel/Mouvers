import { Component } from '@angular/core';
import { NavController, App, LoadingController, Loading, ToastController } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { HttpClient } from '@angular/common/http';
import { StatusOrderPage } from '../status-order/status-order';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { ListCartPage } from '../list-cart/list-cart';
import { CalificationPage } from '../calification/calification';
import { StorageProvider} from '../../providers/storage/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

	itemsInCart: number;
  	type: string = 'hoy';
  	datos: any;
  	datos2: any;
  	orders: any = [];
  	history: any = [];
  	loading: Loading;

	constructor(public navCtrl: NavController, public app: App, public cartProvider: CartProvider, public http: HttpClient, public rutebaseAPI: RuteBaseProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController, public storage: StorageProvider) {
	}

	ionViewWillEnter() {
		this.itemsInCart = this.cartProvider.getCartCount();
		this.initOrder();
	}

	initOrder(){
		this.orders = [];
		this.history = [];
		this.showLoading('Cargando Pedidos...')
		this.http.get(this.rutebaseAPI.getRutaApi()+'usuarios/'+this.cartProvider.getCartId()+'/pedidos/encurso?token='+this.storage.get('tokenMouver'))
		.toPromise()
		.then(
		data => {
		    this.loading.dismiss();
		    this.datos = data;
		    this.orders = this.datos.pedidos;
		    this.initHistory();
		},
		msg => {
		    this.loading.dismiss();
		    this.initHistory();
            if(msg.status == 400 || msg.status == 401){ 
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                this.app.getRootNav().setRoot(LoginPage);
            }
		});
	}

	initHistory(){
		if (this.datos != '') {
			this.http.get(this.rutebaseAPI.getRutaApi()+'usuarios/'+this.cartProvider.getCartId()+'/pedidos/finalizados?token='+this.storage.get('tokenMouver'))
			.toPromise()
			.then(
			data => {
			    this.datos2 = data;
		    	this.history = this.datos2.pedidos;
			},
			msg => {
			    if(msg.status == 400 || msg.status == 401){ 
	                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
	                this.app.getRootNav().setRoot(LoginPage);  
	            }
			});
		}	
	}

	viewOrder(event,item){
		this.navCtrl.push(StatusOrderPage, {details: item});
	}

	viewCalification(event,pedido){
		this.storage.set('pedido_idMouver', pedido.id);
		this.navCtrl.push(CalificationPage);
	}

	gotoCart(){
		this.navCtrl.push(ListCartPage);
	}

	toggleSection(i) {
	    this.history[i].open = !this.history[i].open;
	}

	showLoading(text) {
		this.loading = this.loadingCtrl.create({
		  content: text,
		  spinner: 'ios',
		  duration: 10000
		});
		this.loading.present();
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
