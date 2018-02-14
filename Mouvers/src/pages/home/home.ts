import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	categories: any;

  constructor(public navCtrl: NavController, public app: App) {
  	this.categories = [{imagen:'http://ilp.com.do/wp-content/uploads/2017/07/Interior-de-carro-1200x565.jpg',nombre:'AUTOS'},{imagen:'http://letsbonus2.statics.download/products/197000/197176/13750964217558-0-680x276.jpg',nombre:'LIMPIEZA'},{imagen:'http://gourmetdemexico.com.mx/sites/default/files/styles/imagenes_gourmet/public/field/image/tacos-con-vino.jpg?itok=9qeCdT_j',nombre:'COMIDA'},{imagen:'https://www.compensar.com/img/2017/salud/chequeo-medico.jpg',nombre:'SALUD'}];
  }

  products(){
  	this.navCtrl.push(ProductsPage);
  }

}
