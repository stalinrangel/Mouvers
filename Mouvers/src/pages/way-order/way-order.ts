import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider} from '../../providers/storage/storage';

@Component({
  selector: 'page-way-order',
  templateUrl: 'way-order.html',
})
export class WayOrderPage {

	pedido_id: any;

  	constructor(public http: HttpClient, public rutebaseApi: RuteBaseProvider, public storage: StorageProvider, public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {
  		this.pedido_id = this.navParams.get('pedido_id');
  	}

	ionViewDidLoad() {
		this.http.get(this.rutebaseApi.getRutaApi()+'notificaciones/localizar/repartidores/pedido_id/'+this.pedido_id+'?token='+this.storage.get('tokenMouver'))
		.toPromise()
		.then(
		data => {
		},
		msg => {
		});
		this.presentToast('¡Su pedido ha sido enviado con éxito!');
	}

	presentToast(text) {
		let toast = this.toastCtrl.create({
		  message: text,
		  position: 'top',
		  showCloseButton: true,
		  closeButtonText: 'Ok'
		});

		toast.onDidDismiss(() => {
		  this.navCtrl.popToRoot();
		});

		toast.present();
	}

}
