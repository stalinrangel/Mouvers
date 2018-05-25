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
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { WayOrderPage } from '../way-order/way-order';
import { FormOpenpayPage } from '../form-openpay/form-openpay';
var PaymentsPage = /** @class */ (function () {
    function PaymentsPage(navCtrl, navParams, cartProvider, paypal, http, rutebaseAPI, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cartProvider = cartProvider;
        this.paypal = paypal;
        this.http = http;
        this.rutebaseAPI = rutebaseAPI;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.products = [];
        this.order = {
            lat: null,
            lng: null,
            direccion: null,
            distancia: null,
            tiempo: null,
            subtotal: null,
            costo: null,
            costo_envio: null,
            usuario_id: null,
            productos: null,
            ruta: null
        };
        this.payPalEnvironmentSandbox = 'AfvDVr_ztoOb_x3ba7OWyjJ1tPrP5_n5fruoTSU2dizPJiFcpT1ZGtaPRYmL1Ra-MtRHzh2-_nGqDfGI';
        this.payPalEnvironmentProduction = '';
        this.payPalEnvironment = 'payPalEnvironmentSandbox';
        this.currencies = ['MXN'];
        this.tipos = {
            estado_pago: 'Aprobado',
            api_tipo_pago: 'PayPal'
        };
    }
    PaymentsPage.prototype.initOrder = function (total, subtotal) {
        var _this = this;
        var direction = this.cartProvider.getDireccion();
        this.order.lat = direction.lat;
        this.order.lng = direction.lng;
        this.order.direccion = direction.direccion;
        this.order.distancia = parseFloat(this.cartProvider.getDistance());
        this.order.tiempo = parseFloat(this.cartProvider.getDuration());
        this.order.subtotal = subtotal;
        this.order.costo = total;
        this.order.costo_envio = parseFloat(this.cartProvider.getDelivery());
        this.order.usuario_id = parseInt(this.cartProvider.getCartId());
        this.items = this.cartProvider.getCartContents();
        this.items.forEach(function (elem) {
            _this.products.push({ producto_id: elem.id, cantidad: elem.cantidad, observacion: null, precio_unitario: elem.precio });
        });
        this.order.productos = JSON.stringify(this.products);
        this.order.ruta = JSON.stringify(this.cartProvider.getRoute());
    };
    PaymentsPage.prototype.ionViewWillEnter = function () {
        this.subtotal = this.cartProvider.getCartSubTotal();
        this.delivery = this.cartProvider.getDelivery();
        this.total = (parseFloat(this.subtotal) + parseFloat(this.delivery)).toFixed(2);
        this.initOrder(this.total, this.subtotal);
    };
    PaymentsPage.prototype.payments = function () {
        var _this = this;
        this.payment = new PayPalPayment(this.total, 'MXN', 'Compra Mouvers', 'sale');
        this.showLoading('Enviando pedido...');
        this.http.post(this.rutebaseAPI.getRutaApi() + 'pedidos', this.order)
            .toPromise()
            .then(function (data) {
            _this.datos = data;
            _this.paypal.init({
                PayPalEnvironmentProduction: _this.payPalEnvironmentProduction,
                PayPalEnvironmentSandbox: _this.payPalEnvironmentSandbox
            }).then(function () {
                _this.paypal.prepareToRender(_this.payPalEnvironment, new PayPalConfiguration({})).then(function () {
                    _this.paypal.renderSinglePaymentUI(_this.payment).then(function (response) {
                        if (response.response.state == 'approved') {
                            _this.updateOrder();
                        }
                    }, function () {
                        console.error('Error or render dialog closed without being successful');
                    });
                }, function () {
                    console.error('Error in configuration');
                });
            }, function () {
                console.error('Error in initialization, maybe PayPal isn\'t supported or something else');
            });
        }, function (msg) {
            console.log(msg);
            _this.loading.dismiss();
        });
    };
    PaymentsPage.prototype.updateOrder = function () {
        var _this = this;
        this.loading.setContent('Confirmando pago...');
        this.http.put(this.rutebaseAPI.getRutaApi() + 'pedidos/' + this.datos.pedido.id, this.tipos)
            .toPromise()
            .then(function (data) {
            _this.cartProvider.deleteCar();
            _this.loading.dismiss();
            _this.navCtrl.push(WayOrderPage, { pedido_id: _this.datos.pedido.id });
        }, function (msg) {
            _this.loading.dismiss();
        });
    };
    PaymentsPage.prototype.presentToast = function (text) {
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
    PaymentsPage.prototype.openpay = function () {
        this.navCtrl.push(FormOpenpayPage, { total: this.total });
    };
    PaymentsPage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios',
            duration: 20000
        });
        this.loading.present();
    };
    PaymentsPage = __decorate([
        Component({
            selector: 'page-payments',
            templateUrl: 'payments.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, CartProvider, PayPal, HttpClient, RuteBaseProvider, ToastController, LoadingController])
    ], PaymentsPage);
    return PaymentsPage;
}());
export { PaymentsPage };
//# sourceMappingURL=payments.js.map