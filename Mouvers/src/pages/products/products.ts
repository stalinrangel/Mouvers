import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController, AlertController } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { ListCartPage } from '../list-cart/list-cart';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider} from '../../providers/storage/storage';
import 'rxjs/add/operator/map'

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  information: any[];
  products: any = [];
  datos: any;
  id: string = '';
  loading: Loading;
  quantity:number = 1;
  itemsInCart: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider, private http: HttpClient, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private alertCtrl: AlertController, public cartProvider: CartProvider, public rutebaseAPI: RuteBaseProvider) {
    this.id = navParams.get('id');
    this.initProducts();
  }

  initProducts(){
    this.showLoading('Cargando Productos...');
    this.http.get(this.rutebaseAPI.getRutaApi()+'categorias/' + this.id + '?token=' + this.storage.get('tokenMouver'))
    .toPromise()
    .then(
      data => {
        this.datos = data;
        if (this.datos.subcategorias != '') {
          this.products = this.datos.subcategorias;
          this.loading.dismiss();
          if (this.products == '') {
            this.presentToast('¡Por el momento, no hay productos disponibles en esta categoría!',3000)
            this.navCtrl.popToRoot();
          }
        } else {
          this.loading.dismiss();
          this.presentToast('¡Por el momento, no hay productos disponibles en esta categoría!',3000)
          this.navCtrl.popToRoot();
        }
      },
      msg => {
        this.loading.dismiss();
        this.presentToast('¡Ha ocurrido un error al cargar los productos!',3000)
    });
  }

  ionViewWillEnter() {
    this.itemsInCart = this.cartProvider.getCartCount();
  }

  toggleSection(i) {
    this.products[i].open = !this.products[i].open;
  }
 
  toggleItem(i, j) {
    this.products[i].establecimientos[j].open = !this.products[i].establecimientos[j].open;
  }

  gotoCart(){
    this.navCtrl.push(ListCartPage);
  }

  showLoading(text) {
    this.loading = this.loadingCtrl.create({
      content: text,
      spinner: 'ios'
    });
    this.loading.present();
  }

  presentToast(text,time) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: time,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  buyItem(event, item, child) {
    this.cartProvider.addProduct(item, this.quantity, child.lat, child.lng, child.nombre).subscribe(
      success => {
        if (success) {
          this.itemsInCart = this.cartProvider.getCartCount();
          this.presentToast('¡Producto agregado!',1500);
          this.presentCheckout();
        } else {
          this.presentToast('Ha ocurrido un error intenta de nuevo',3000);
        }
      },
      error => {
        this.presentToast(error,1500);
      }
    );
  }

  presentCheckout() {
    const alert = this.alertCtrl.create({
      title: 'Finalizar compra',
      message: '¿Ha finalizado la compra?',
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
            this.navCtrl.push(ListCartPage);
          }
        }
      ]
    });
    alert.present();
  }
}
