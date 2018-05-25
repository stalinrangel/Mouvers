var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef } from '@angular/core';
import { CartProvider } from '../../providers/cart/cart';
import { NavController, App, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ListCartPage } from '../list-cart/list-cart';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';
var CalificationPage = /** @class */ (function () {
    function CalificationPage(navCtrl, app, navParams, element, http, loadingCtrl, toastCtrl, cartProvider, storage, rutebaseAPI) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.navParams = navParams;
        this.element = element;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.cartProvider = cartProvider;
        this.storage = storage;
        this.rutebaseAPI = rutebaseAPI;
        this.Calification = {
            puntaje: 0,
            comentario: '',
            pedido_id: '',
            token: this.storage.get('tokenMouver')
        };
        this.Calification.pedido_id = this.storage.get('pedido_idMouver');
    }
    CalificationPage.prototype.ngAfterViewInit = function () {
        this.element.nativeElement.querySelector("textarea").style.height = "150px";
    };
    CalificationPage.prototype.onModelChange = function (ev) {
        this.Calification.puntaje = ev;
    };
    CalificationPage.prototype.gotoCart = function () {
        this.navCtrl.push(ListCartPage);
    };
    CalificationPage.prototype.sendCalification = function () {
        var _this = this;
        if (this.Calification.puntaje == 0) {
            this.presentToast('Debes asignar un puntaje para enviar la calificación');
        }
        else {
            this.showLoading('Enviando calificación');
            this.http.post(this.rutebaseAPI.getRutaApi() + 'calificaciones', this.Calification)
                .toPromise()
                .then(function (data) {
                _this.loading.dismiss();
                _this.presentToast('¡Gracias por Calificarnos!');
                _this.navCtrl.pop();
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
        }
    };
    CalificationPage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios',
            duration: 10000
        });
        this.loading.present();
    };
    CalificationPage.prototype.presentToast = function (text) {
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
    CalificationPage = __decorate([
        Component({
            selector: 'page-calification',
            templateUrl: 'calification.html',
        }),
        __metadata("design:paramtypes", [NavController, App, NavParams, ElementRef, HttpClient, LoadingController, ToastController, CartProvider, StorageProvider, RuteBaseProvider])
    ], CalificationPage);
    return CalificationPage;
}());
export { CalificationPage };
//# sourceMappingURL=calification.js.map