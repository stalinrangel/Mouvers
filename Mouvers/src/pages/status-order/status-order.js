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
import { NavController, NavParams } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { ListCartPage } from '../list-cart/list-cart';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
var StatusOrderPage = /** @class */ (function () {
    function StatusOrderPage(navCtrl, navParams, cartProvider, http, rutebaseAPI) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cartProvider = cartProvider;
        this.http = http;
        this.rutebaseAPI = rutebaseAPI;
        this.repartidor = {
            usuario: {
                imagen: 'assets/imgs/user-white.png',
                telefono: ''
            }
        };
        this.items = navParams.get('details');
        console.log(this.items);
        this.getRepartidor();
    }
    StatusOrderPage.prototype.ionViewWillEnter = function () {
        this.itemsInCart = this.cartProvider.getCartCount();
    };
    StatusOrderPage.prototype.gotoCart = function () {
        this.navCtrl.push(ListCartPage);
    };
    StatusOrderPage.prototype.getRepartidor = function () {
        var _this = this;
        this.http.get(this.rutebaseAPI.getRutaApi() + 'repartidores/2')
            .toPromise()
            .then(function (data) {
            console.log(data);
            _this.datos = data;
            _this.repartidor = _this.datos.repartidor;
        }, function (msg) {
            console.log(msg);
        });
    };
    StatusOrderPage = __decorate([
        Component({
            selector: 'page-status-order',
            templateUrl: 'status-order.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, CartProvider, HttpClient, RuteBaseProvider])
    ], StatusOrderPage);
    return StatusOrderPage;
}());
export { StatusOrderPage };
//# sourceMappingURL=status-order.js.map