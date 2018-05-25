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
import { CartProvider } from '../../providers/cart/cart';
import { MapPage } from '../map/map';
var ListCartPage = /** @class */ (function () {
    function ListCartPage(navCtrl, navParams, cartProvider, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cartProvider = cartProvider;
        this.toastCtrl = toastCtrl;
        this.items = this.cartProvider.getCartContents();
    }
    ListCartPage.prototype.ionViewWillEnter = function () {
        this.items = this.cartProvider.getCartContents();
        this.itemsInCart = this.cartProvider.getCartCount();
        this.total = this.cartProvider.getCartSubTotal();
    };
    ListCartPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ListCartPage');
    };
    ListCartPage.prototype.removeItem = function (item) {
        var _this = this;
        this.cartProvider.removeProduct(item).subscribe(function (success) {
            if (success) {
                _this.items = _this.cartProvider.getCartContents();
                _this.itemsInCart = _this.cartProvider.getCartCount();
                _this.total = _this.cartProvider.getCartSubTotal();
            }
            else {
                _this.presentToast('Ha ocurrido un error intenta de nuevo');
            }
        }, function (error) {
            _this.presentToast(error);
        });
    };
    ListCartPage.prototype.updateCant = function (item) {
        var _this = this;
        this.cartProvider.updateProduct(item, item.cantidad).subscribe(function (success) {
            if (success) {
                _this.items = _this.cartProvider.getCartContents();
                _this.itemsInCart = _this.cartProvider.getCartCount();
                _this.total = _this.cartProvider.getCartSubTotal();
            }
            else {
                _this.presentToast('Ha ocurrido un error intenta de nuevo');
            }
        }, function (error) {
            _this.presentToast(error);
        });
    };
    ListCartPage.prototype.gotoMap = function () {
        this.navCtrl.push(MapPage);
    };
    ListCartPage.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    ListCartPage.prototype.presentToast = function (text) {
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
    ListCartPage = __decorate([
        Component({
            selector: 'page-list-cart',
            templateUrl: 'list-cart.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, CartProvider, ToastController])
    ], ListCartPage);
    return ListCartPage;
}());
export { ListCartPage };
//# sourceMappingURL=list-cart.js.map