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
import { NavController, App, AlertController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';
import { Facebook } from '@ionic-native/facebook';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { CartProvider } from '../../providers/cart/cart';
var ContactPage = /** @class */ (function () {
    function ContactPage(navCtrl, app, storage, facebook, cartProvider, alertCtrl) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.storage = storage;
        this.facebook = facebook;
        this.cartProvider = cartProvider;
        this.alertCtrl = alertCtrl;
        this.usuario = this.storage.getObject('userMouver');
    }
    ContactPage.prototype.salir = function () {
        var _this = this;
        this.facebook.getLoginStatus()
            .then(function (rta) {
            if (rta.status == 'connected') {
                _this.facebook.logout()
                    .then(function (rta) {
                    _this.storage.set('tokenMouver', '');
                    _this.storage.setObject('userMouver', '');
                    _this.storage.set('pedido_idMouver', '');
                    _this.cartProvider.deleteCar();
                    _this.app.getRootNav().setRoot(LoginPage);
                })
                    .catch(function (error) {
                    alert('error no conectado a facebook');
                    _this.storage.set('tokenMouver', '');
                    _this.storage.setObject('userMouver', '');
                    _this.storage.set('pedido_idMouver', '');
                    _this.cartProvider.deleteCar();
                    _this.app.getRootNav().setRoot(LoginPage);
                });
            }
            else {
                _this.storage.set('tokenMouver', '');
                _this.storage.setObject('userMouver', '');
                _this.storage.set('pedido_idMouver', '');
                _this.cartProvider.deleteCar();
                _this.app.getRootNav().setRoot(LoginPage);
            }
        })
            .catch(function (error) {
            _this.storage.set('tokenMouver', '');
            _this.storage.setObject('userMouver', '');
            _this.storage.set('pedido_idMouver', '');
            _this.cartProvider.deleteCar();
            _this.app.getRootNav().setRoot(LoginPage);
        });
    };
    ContactPage.prototype.editProfile = function () {
        this.navCtrl.push(EditProfilePage);
    };
    ContactPage.prototype.presentConfirm = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Cerrar Sesión',
            message: '¿Desea cerrar sesión de Möuvers?',
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
                        _this.salir();
                    }
                }
            ]
        });
        alert.present();
    };
    ContactPage = __decorate([
        Component({
            selector: 'page-contact',
            templateUrl: 'contact.html'
        }),
        __metadata("design:paramtypes", [NavController, App, StorageProvider, Facebook, CartProvider, AlertController])
    ], ContactPage);
    return ContactPage;
}());
export { ContactPage };
//# sourceMappingURL=contact.js.map