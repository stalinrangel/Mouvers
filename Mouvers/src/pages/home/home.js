var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, App, LoadingController, ToastController } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { HttpClient } from '@angular/common/http';
import { CartProvider } from '../../providers/cart/cart';
import { ListCartPage } from '../list-cart/list-cart';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, app, http, storage, loadingCtrl, toastCtrl, cartProvider, rutebaseAPI) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.http = http;
        this.storage = storage;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.cartProvider = cartProvider;
        this.rutebaseAPI = rutebaseAPI;
        //this.categories = [{imagen:'http://ilp.com.do/wp-content/uploads/2017/07/Interior-de-carro-1200x565.jpg',nombre:'AUTOS'},{imagen:'http://letsbonus2.statics.download/products/197000/197176/13750964217558-0-680x276.jpg',nombre:'LIMPIEZA'},{imagen:'http://gourmetdemexico.com.mx/sites/default/files/styles/imagenes_gourmet/public/field/image/tacos-con-vino.jpg?itok=9qeCdT_j',nombre:'COMIDA'},{imagen:'https://www.compensar.com/img/2017/salud/chequeo-medico.jpg',nombre:'SALUD'}];
        this.initCategory();
    }
    HomePage.prototype.initCategory = function () {
        var _this = this;
        this.showLoading('Cargando Menú...');
        this.http.get(this.rutebaseAPI.getRutaApi() + 'categorias/habilitadas?token=' + this.storage.get('tokenMouver'))
            .toPromise()
            .then(function (data) {
            _this.datos = data;
            _this.categories = _this.datos.categorias;
            _this.loading.dismiss();
        }, function (msg) {
            _this.loading.dismiss();
            if (msg.status == 400 || msg.status == 401) {
                _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                _this.app.getRootNav().setRoot(LoginPage);
            }
            else {
                _this.presentToast(msg.error.error);
            }
        });
    };
    HomePage.prototype.ionViewWillEnter = function () {
        this.itemsInCart = this.cartProvider.getCartCount();
    };
    HomePage.prototype.products = function (item) {
        this.navCtrl.push(ProductsPage, { id: item.id });
    };
    HomePage.prototype.gotoCart = function () {
        this.navCtrl.push(ListCartPage);
    };
    HomePage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios',
            duration: 10000
        });
        this.loading.present();
    };
    HomePage.prototype.presentToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController, App, HttpClient, StorageProvider, LoadingController, ToastController, CartProvider, RuteBaseProvider])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map