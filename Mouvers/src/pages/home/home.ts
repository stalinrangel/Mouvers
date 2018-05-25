import { Component } from '@angular/core';
import { NavController, App, LoadingController, Loading, ToastController } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { HttpClient } from '@angular/common/http';
import { CartProvider } from '../../providers/cart/cart';
import { ListCartPage } from '../list-cart/list-cart';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider} from '../../providers/storage/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	categories: any;
	datos: any;
	loading: Loading;
  itemsInCart: number;

  constructor(public navCtrl: NavController, public app: App, public http: HttpClient, private storage: StorageProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController, public cartProvider: CartProvider, public rutebaseAPI: RuteBaseProvider) {
  	//this.categories = [{imagen:'http://ilp.com.do/wp-content/uploads/2017/07/Interior-de-carro-1200x565.jpg',nombre:'AUTOS'},{imagen:'http://letsbonus2.statics.download/products/197000/197176/13750964217558-0-680x276.jpg',nombre:'LIMPIEZA'},{imagen:'http://gourmetdemexico.com.mx/sites/default/files/styles/imagenes_gourmet/public/field/image/tacos-con-vino.jpg?itok=9qeCdT_j',nombre:'COMIDA'},{imagen:'https://www.compensar.com/img/2017/salud/chequeo-medico.jpg',nombre:'SALUD'}];
  	this.initCategory();
  }

  initCategory(){
  	this.showLoading('Cargando Menú...')
  	this.http.get(this.rutebaseAPI.getRutaApi()+'categorias/habilitadas?token='+this.storage.get('tokenMouver'))
    .toPromise()
    .then(
      data => {
        this.datos = data;
        this.categories = this.datos.categorias;
        this.loading.dismiss();
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

  ionViewWillEnter() {
    this.itemsInCart = this.cartProvider.getCartCount();
  }

  products(item){
  	this.navCtrl.push(ProductsPage, {id: item.id});
  }

  gotoCart(){
    this.navCtrl.push(ListCartPage);
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
