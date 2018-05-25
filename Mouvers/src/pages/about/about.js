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
import { CartProvider } from '../../providers/cart/cart';
import { HttpClient } from '@angular/common/http';
import { StatusOrderPage } from '../status-order/status-order';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { ListCartPage } from '../list-cart/list-cart';
import { CalificationPage } from '../calification/calification';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';
var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl, app, cartProvider, http, rutebaseAPI, loadingCtrl, toastCtrl, storage) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.cartProvider = cartProvider;
        this.http = http;
        this.rutebaseAPI = rutebaseAPI;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.type = 'hoy';
        this.orders = [];
        this.history = [];
    }
    AboutPage.prototype.ionViewWillEnter = function () {
        this.itemsInCart = this.cartProvider.getCartCount();
        this.initOrder();
    };
    AboutPage.prototype.initOrder = function () {
        var _this = this;
        this.orders = [];
        this.history = [];
        this.showLoading('Cargando Pedidos...');
        this.http.get(this.rutebaseAPI.getRutaApi() + 'usuarios/' + this.cartProvider.getCartId() + '/pedidos/encurso?token=' + this.storage.get('tokenMouver'))
            .toPromise()
            .then(function (data) {
            _this.loading.dismiss();
            _this.datos = data;
            _this.orders = _this.datos.pedidos;
            _this.initHistory();
        }, function (msg) {
            _this.loading.dismiss();
            _this.initHistory();
            if (msg.status == 400 || msg.status == 401) {
                _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                _this.app.getRootNav().setRoot(LoginPage);
            }
        });
    };
    AboutPage.prototype.initHistory = function () {
        var _this = this;
        if (this.datos != '') {
            this.http.get(this.rutebaseAPI.getRutaApi() + 'usuarios/' + this.cartProvider.getCartId() + '/pedidos/finalizados?token=' + this.storage.get('tokenMouver'))
                .toPromise()
                .then(function (data) {
                _this.datos2 = data;
                _this.history = _this.datos2.pedidos;
            }, function (msg) {
                if (msg.status == 400 || msg.status == 401) {
                    _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                    _this.app.getRootNav().setRoot(LoginPage);
                }
            });
        }
    };
    AboutPage.prototype.viewOrder = function (event, item) {
        this.navCtrl.push(StatusOrderPage, { details: item });
    };
    AboutPage.prototype.viewCalification = function (event, pedido) {
        this.storage.set('pedido_idMouver', pedido.id);
        this.navCtrl.push(CalificationPage);
    };
    AboutPage.prototype.gotoCart = function () {
        this.navCtrl.push(ListCartPage);
    };
    AboutPage.prototype.toggleSection = function (i) {
        this.history[i].open = !this.history[i].open;
    };
    AboutPage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios',
            duration: 10000
        });
        this.loading.present();
    };
    AboutPage.prototype.presentToast = function (text) {
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
    AboutPage = __decorate([
        Component({
            selector: 'page-about',
            templateUrl: 'about.html'
        }),
        __metadata("design:paramtypes", [NavController, App, CartProvider, HttpClient, RuteBaseProvider, LoadingController, ToastController, StorageProvider])
    ], AboutPage);
    return AboutPage;
}());
export { AboutPage };
//# sourceMappingURL=about.js.map