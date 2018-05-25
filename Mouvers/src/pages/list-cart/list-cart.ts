import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-list-cart',
  templateUrl: 'list-cart.html',
})
export class ListCartPage {

  public items: any;
  public itemsInCart: number;
  public total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cartProvider: CartProvider, private toastCtrl: ToastController) {
  	this.items = this.cartProvider.getCartContents();
  }

  ionViewWillEnter() {
    this.items = this.cartProvider.getCartContents();
    this.itemsInCart = this.cartProvider.getCartCount();
    this.total = this.cartProvider.getCartSubTotal();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListCartPage');
  }

  removeItem(item){
  	this.cartProvider.removeProduct(item).subscribe(
      success => {
        if (success) {
          this.items = this.cartProvider.getCartContents();
          this.itemsInCart = this.cartProvider.getCartCount();
          this.total = this.cartProvider.getCartSubTotal();
        } else {
          this.presentToast('Ha ocurrido un error intenta de nuevo');
        }
      },
      error => {
        this.presentToast(error);
      }
    );
  }

  updateCant(item){
    this.cartProvider.updateProduct(item,item.cantidad).subscribe(
      success => {
        if (success) {
          this.items = this.cartProvider.getCartContents();
          this.itemsInCart = this.cartProvider.getCartCount();
          this.total = this.cartProvider.getCartSubTotal();
        } else {
          this.presentToast('Ha ocurrido un error intenta de nuevo');
        }
      },
      error => {
        this.presentToast(error);
      }
    );
  }

  gotoMap(){
    this.navCtrl.push(MapPage);
  }

  goBack(){
    this.navCtrl.pop();
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
