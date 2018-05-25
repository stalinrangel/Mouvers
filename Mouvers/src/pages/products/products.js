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
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { ListCartPage } from '../list-cart/list-cart';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage';
import 'rxjs/add/operator/map';
var ProductsPage = /** @class */ (function () {
    function ProductsPage(navCtrl, navParams, storage, http, loadingCtrl, toastCtrl, alertCtrl, cartProvider, rutebaseAPI) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.cartProvider = cartProvider;
        this.rutebaseAPI = rutebaseAPI;
        this.products = [];
        this.id = '';
        this.quantity = 1;
        this.id = navParams.get('id');
        this.initProducts();
    }
    ProductsPage.prototype.initProducts = function () {
        var _this = this;
        this.showLoading('Cargando Productos...');
        this.http.get(this.rutebaseAPI.getRutaApi() + 'categorias/' + this.id + '?token=' + this.storage.get('tokenMouver'))
            .toPromise()
            .then(function (data) {
            _this.datos = data;
            if (_this.datos.subcategorias != '') {
                _this.products = _this.datos.subcategorias;
                _this.loading.dismiss();
                if (_this.products == '') {
                    _this.presentToast('¡Por el momento, no hay productos disponibles en esta categoría!', 3000);
                    _this.navCtrl.popToRoot();
                }
            }
            else {
                _this.loading.dismiss();
                _this.presentToast('¡Por el momento, no hay productos disponibles en esta categoría!', 3000);
                _this.navCtrl.popToRoot();
            }
        }, function (msg) {
            _this.loading.dismiss();
            _this.presentToast('¡Ha ocurrido un error al cargar los productos!', 3000);
        });
    };
    ProductsPage.prototype.ionViewWillEnter = function () {
        this.itemsInCart = this.cartProvider.getCartCount();
    };
    ProductsPage.prototype.toggleSection = function (i) {
        this.products[i].open = !this.products[i].open;
    };
    ProductsPage.prototype.toggleItem = function (i, j) {
        this.products[i].establecimientos[j].open = !this.products[i].establecimientos[j].open;
    };
    ProductsPage.prototype.gotoCart = function () {
        this.navCtrl.push(ListCartPage);
    };
    ProductsPage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios'
        });
        this.loading.present();
    };
    ProductsPage.prototype.presentToast = function (text, time) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: time,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ProductsPage.prototype.buyItem = function (event, item, child) {
        var _this = this;
        this.cartProvider.addProduct(item, this.quantity, child.lat, child.lng, child.nombre).subscribe(function (success) {
            if (success) {
                _this.itemsInCart = _this.cartProvider.getCartCount();
                _this.presentToast('¡Producto agregado!', 1500);
                _this.presentCheckout();
            }
            else {
                _this.presentToast('Ha ocurrido un error intenta de nuevo', 3000);
            }
        }, function (error) {
            _this.presentToast(error, 1500);
        });
    };
    ProductsPage.prototype.presentCheckout = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Finalizar compra',
            message: '¿Ha finalizado la compra?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Si',
                    handler: function () {
                        _this.navCtrl.push(ListCartPage);
                    }
                }
            ]
        });
        alert.present();
    };
    ProductsPage = __decorate([
        Component({
            selector: 'page-products',
            templateUrl: 'products.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, StorageProvider, HttpClient, LoadingController, ToastController, AlertController, CartProvider, RuteBaseProvider])
    ], ProductsPage);
    return ProductsPage;
}());
export { ProductsPage };
//# sourceMappingURL=products.js.map