import { Component, ElementRef } from '@angular/core';
import { CartProvider } from '../../providers/cart/cart';
import { NavController, App, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ListCartPage } from '../list-cart/list-cart';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider} from '../../providers/storage/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-calification',
  templateUrl: 'calification.html',
})
export class CalificationPage {

	public Calification = {
		puntaje: 0,
		comentario: '',
		pedido_id: '',
    token: this.storage.get('tokenMouver')
	}
	loading: Loading;
	pedido_id: any;

  constructor(public navCtrl: NavController, public app: App, public navParams: NavParams, public element:ElementRef, public http: HttpClient, private loadingCtrl: LoadingController, private toastCtrl: ToastController, public cartProvider: CartProvider, public storage: StorageProvider, public rutebaseAPI: RuteBaseProvider) {
  	this.Calification.pedido_id = this.storage.get('pedido_idMouver');
  }

  ngAfterViewInit(){
    this.element.nativeElement.querySelector("textarea").style.height = "150px";
  }

  onModelChange(ev){
  	this.Calification.puntaje = ev;
  }

  gotoCart(){
    this.navCtrl.push(ListCartPage);
  }

  sendCalification(){
  	if (this.Calification.puntaje == 0) {
  		this.presentToast('Debes asignar un puntaje para enviar la calificación')
  	} else {
  		this.showLoading('Enviando calificación')
  		this.http.post(this.rutebaseAPI.getRutaApi()+'calificaciones', this.Calification)
	    .toPromise()
	    .then(
	      data => {
	        this.loading.dismiss();
	        this.presentToast('¡Gracias por Calificarnos!');
	        this.navCtrl.pop();
	      },
	      msg => {
	        this.loading.dismiss();
          if(msg.status == 400 || msg.status == 401){ 
            this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
            this.app.getRootNav().setRoot(LoginPage);
          } else {
            this.presentToast(msg.error.error);
          }
	    });
  	}
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
