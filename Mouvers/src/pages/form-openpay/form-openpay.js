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
import { NavController, NavParams, App, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { WayOrderPage } from '../way-order/way-order';
import { CartProvider } from '../../providers/cart/cart';
import { LoginPage } from '../login/login';
var FormOpenpayPage = /** @class */ (function () {
    function FormOpenpayPage(navCtrl, app, navParams, builder, storage, http, rutebaseApi, cartProvider, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.navParams = navParams;
        this.builder = builder;
        this.storage = storage;
        this.http = http;
        this.rutebaseApi = rutebaseApi;
        this.cartProvider = cartProvider;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.user = {};
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
            ruta: null,
            token: null
        };
        this.formErrors = {
            "card_number": "",
            "holder_name": "",
            "expiration_year": "",
            "expiration_month": "",
            "cvv2": ""
        };
        this.cargo = {
            "source_id": "",
            "method": "card",
            "amount": 0,
            "currency": "MXN",
            "description": "compra en Mouvers",
            "device_session_id": "",
            "customer": {
                "name": "",
                "last_name": "",
                "phone_number": "",
                "email": ""
            }
        };
        this.tipos = {
            estado_pago: 'declinado',
            api_tipo_pago: 'TDD/TDC',
            token: this.storage.get('tokenMouver')
        };
        OpenPay.setId('mar9y504wykxrxgisycl');
        OpenPay.setApiKey('pk_93f0da9550f54da1a5e393345004bb79');
        OpenPay.setSandboxMode(true);
        this.total = this.navParams.get('total');
        this.initForm();
        this.initOrder();
    }
    FormOpenpayPage.prototype.initForm = function () {
        var _this = this;
        this.paymentForm = this.builder.group({
            card_number: ['4111111111111111', [Validators.required, Validators.minLength(16), Validators.maxLength(19)]],
            holder_name: ['Juan Perez Ramirez', [Validators.required]],
            expiration_year: ['20', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
            expiration_month: ['12', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
            cvv2: ['110', [Validators.required, Validators.minLength(3)]]
        });
        this.paymentForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
        this.deviceSessionId = OpenPay.deviceData.setup(this.paymentForm.value);
        this.cargo.device_session_id = this.deviceSessionId;
        this.cargo.amount = parseFloat(this.total);
        this.user = this.storage.getObject('userMouver');
        this.cargo.customer.name = this.user.nombre;
        this.cargo.customer.phone_number = this.user.telefono;
        this.cargo.customer.email = this.user.email;
    };
    FormOpenpayPage.prototype.initOrder = function () {
        var _this = this;
        this.delivery = this.cartProvider.getDelivery();
        this.direction = this.cartProvider.getDireccion();
        this.order.lat = this.direction.lat;
        this.order.lng = this.direction.lng;
        this.order.direccion = this.direction.direccion;
        this.order.distancia = parseFloat(this.cartProvider.getDistance());
        this.order.tiempo = parseFloat(this.cartProvider.getDuration());
        this.order.subtotal = parseFloat(this.cartProvider.getCartSubTotal());
        this.order.costo = parseFloat(this.total);
        this.order.costo_envio = parseFloat(this.cartProvider.getDelivery());
        this.order.usuario_id = parseInt(this.cartProvider.getCartId());
        this.items = this.cartProvider.getCartContents();
        this.items.forEach(function (elem) {
            _this.products.push({ producto_id: elem.id, cantidad: elem.cantidad, observacion: null, precio_unitario: elem.precio });
        });
        this.order.productos = JSON.stringify(this.products);
        this.order.ruta = JSON.stringify(this.cartProvider.getRoute());
        this.order.token = this.storage.get('tokenMouver');
    };
    FormOpenpayPage.prototype.pagar = function (form) {
        var _this = this;
        console.log(this.order);
        this.showLoading('Enviando pedido...');
        this.http.post(this.rutebaseApi.getRutaApi() + 'pedidos', this.order)
            .toPromise()
            .then(function (data) {
            _this.datos_id = data;
            var that = _this;
            _this.loading.setContent('Validando información...');
            OpenPay.token.create(form.value, function SuccessCallback(response) {
                that.cargo.source_id = response.data.id;
                that.paymentCharge();
            }, function ErrorCallback(response) {
                var _this = this;
                this.http.delete(this.rutebaseApi.getRutaApi() + 'pedidos/' + this.datos_id.pedido.id + '?token=' + this.storage.get('tokenMouver'))
                    .toPromise()
                    .then(function (data) {
                    _this.presentToast('No hemos podido validar tu tarjeta, por favor verifica los datos');
                    _this.loading.dismiss();
                }, function (msg) {
                    _this.loading.dismiss();
                    if (msg.status == 400 || msg.status == 401) {
                        _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                        _this.app.getRootNav().setRoot(LoginPage);
                    }
                });
            });
        }, function (msg) {
            _this.loading.dismiss();
            if (msg.status == 400 || msg.status == 401) {
                _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo', 3000);
                _this.app.getRootNav().setRoot(LoginPage);
            }
            else {
                _this.presentToast(msg.error.error, 3000);
            }
        });
    };
    FormOpenpayPage.prototype.paymentCharge = function () {
        var _this = this;
        this.loading.setContent('Generando el pago...');
        var headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa('sk_a2e0e125d1e747cf80153d7876d2a47c' + ":"));
        headers = headers.append("Content-Type", "application/json");
        this.http.post('https://sandbox-api.openpay.mx/v1/mar9y504wykxrxgisycl/charges', this.cargo, {
            headers: headers
        })
            .toPromise()
            .then(function (data) {
            _this.datos = data;
            if (_this.datos.status == 'completed') {
                _this.tipos.estado_pago = 'aprobado';
                _this.payment();
            }
        }, function (msg) {
            console.log(msg);
            _this.http.delete(_this.rutebaseApi.getRutaApi() + 'pedidos/' + _this.datos_id.pedido.id + '?token=' + _this.storage.get('tokenMouver'))
                .toPromise()
                .then(function (data) {
                _this.presentToast('No hemos podido generar tu pago, por favor verifica los datos de tu tarjeta', 3000);
                _this.loading.dismiss();
            }, function (msg) {
                _this.loading.dismiss();
                if (msg.status == 400 || msg.status == 401) {
                    _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo', 3000);
                    _this.app.getRootNav().setRoot(LoginPage);
                }
                else {
                    _this.presentToast(msg.error.error, 3000);
                }
            });
        });
    };
    FormOpenpayPage.prototype.payment = function () {
        var _this = this;
        this.loading.setContent('Confirmando pago...');
        this.http.put(this.rutebaseApi.getRutaApi() + 'pedidos/' + this.datos_id.pedido.id, this.tipos)
            .toPromise()
            .then(function (data) {
            _this.cartProvider.deleteCar();
            _this.loading.dismiss();
            _this.navCtrl.push(WayOrderPage, { pedido_id: _this.datos_id.pedido.id });
        }, function (msg) {
            _this.loading.dismiss();
            if (msg.status == 400 || msg.status == 401) {
                _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo', 3000);
                _this.app.getRootNav().setRoot(LoginPage);
            }
            else {
                _this.presentToast(msg.error.error, 3000);
            }
        });
    };
    FormOpenpayPage.prototype.onValueChanged = function (data) {
        if (!this.paymentForm) {
            return;
        }
        var form = this.paymentForm;
        for (var field in this.formErrors) {
            var control = form.get(field);
            this.formErrors[field] = '';
            if (control && control.dirty && !control.valid) {
                for (var key in control.errors) {
                    this.formErrors[field] += true;
                    console.log(key);
                }
            }
        }
    };
    FormOpenpayPage.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            var control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty({ onlySelf: true });
                _this.onValueChanged();
            }
            else if (control instanceof FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    FormOpenpayPage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios',
            duration: 20000
        });
        this.loading.present();
    };
    FormOpenpayPage.prototype.presentToast = function (text, time) {
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
    FormOpenpayPage = __decorate([
        Component({
            selector: 'page-form-openpay',
            templateUrl: 'form-openpay.html',
        }),
        __metadata("design:paramtypes", [NavController, App, NavParams, FormBuilder, StorageProvider, HttpClient, RuteBaseProvider, CartProvider, ToastController, LoadingController])
    ], FormOpenpayPage);
    return FormOpenpayPage;
}());
export { FormOpenpayPage };
//# sourceMappingURL=form-openpay.js.map