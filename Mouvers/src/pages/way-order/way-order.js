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
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
var WayOrderPage = /** @class */ (function () {
    function WayOrderPage(http, rutebaseApi, navCtrl, navParams, toastCtrl) {
        this.http = http;
        this.rutebaseApi = rutebaseApi;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.pedido_id = this.navParams.get('pedido_id');
    }
    WayOrderPage.prototype.ionViewDidLoad = function () {
        this.http.get(this.rutebaseApi.getRutaApi() + 'notificaciones/localizar/repartidores/pedido_id/' + this.pedido_id)
            .toPromise()
            .then(function (data) {
        }, function (msg) {
        });
        this.presentToast('¡Su pedido ha sido enviado con éxito!');
    };
    WayOrderPage.prototype.presentToast = function (text) {
        var _this = this;
        var toast = this.toastCtrl.create({
            message: text,
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'Ok'
        });
        toast.onDidDismiss(function () {
            _this.navCtrl.popToRoot();
        });
        toast.present();
    };
    WayOrderPage = __decorate([
        Component({
            selector: 'page-way-order',
            templateUrl: 'way-order.html',
        }),
        __metadata("design:paramtypes", [HttpClient, RuteBaseProvider, NavController, NavParams, ToastController])
    ], WayOrderPage);
    return WayOrderPage;
}());
export { WayOrderPage };
//# sourceMappingURL=way-order.js.map