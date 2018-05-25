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
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { TabsPage } from '../tabs/tabs';
var ConfirmInfoPage = /** @class */ (function () {
    function ConfirmInfoPage(navCtrl, auth, navParams, http, loadingCtrl, builder, alertCtrl, toastCtrl, rutebaseApi) {
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.navParams = navParams;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.builder = builder;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.rutebaseApi = rutebaseApi;
        this.user = {};
        this.city = 'Ciudad';
        this.ciudades = [];
        this.createSuccess = false;
        this.formErrors = {
            'nombre': '',
            'telefono': '',
            'email': '',
            'ciudad': '',
            'estado': ''
        };
        this.user = navParams.get('user');
        this.initForm();
    }
    ConfirmInfoPage.prototype.initForm = function () {
        var _this = this;
        this.registerUserForm = this.builder.group({
            nombre: [this.user.nombre, [Validators.required, Validators.minLength(2)]],
            telefono: ['', [Validators.required, Validators.maxLength(10)]],
            email: [this.user.email, [Validators.required, Validators.email]],
            imagen: [this.user.imagen],
            tipo_usuario: [2],
            tipo_registro: [this.user.tipo_registro],
            ciudad: ['', [Validators.required]],
            estado: ['', [Validators.required]],
            id_facebook: [this.user.id_facebook],
            id_twitter: [this.user.id_twitter],
            id_instagram: [this.user.id_instagram],
            check: [false],
            token_notificacion: [this.user.token_notificacion]
        });
        this.registerUserForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
        this.page();
    };
    ConfirmInfoPage.prototype.page = function () {
        var _this = this;
        this.showLoadingc();
        this.http.get(this.rutebaseApi.getRutaApi() + 'entidades/municipios')
            .toPromise()
            .then(function (data) {
            _this.datos = data;
            _this.estados = _this.datos.entidades;
            _this.registerUserForm.patchValue({ estado: _this.estados[0].nom_ent });
            _this.setEstado(_this.estados[0].nom_ent);
            _this.loading.dismiss();
        }, function (msg) {
            _this.presentToast('No se pudo cargar los estados y ciudades, intenta de nuevo');
            _this.loading.dismiss();
        });
    };
    ConfirmInfoPage.prototype.setEstado = function (estado) {
        for (var i = 0; i < this.estados.length; ++i) {
            if (estado == this.estados[i].nom_ent) {
                this.ciudades = this.estados[i].municipios;
                this.registerUserForm.patchValue({ ciudad: this.estados[i].municipios[0].nom_mun });
            }
        }
        if (estado === 'Ciudad de México') {
            this.city = 'Delegación';
        }
        else {
            this.city = 'Ciudad';
        }
    };
    ConfirmInfoPage.prototype.register = function () {
        var _this = this;
        this.registerUserForm.value.email = this.registerUserForm.value.email.toLowerCase();
        if (this.registerUserForm.valid) {
            if (this.registerUserForm.value.check) {
                this.showLoading();
                this.auth.registerSocial(this.registerUserForm.value).subscribe(function (success) {
                    if (success) {
                        _this.loading.dismiss();
                        _this.createSuccess = true;
                        _this.showPopup("Completado", "Usuario registrado con éxito.");
                    }
                    else {
                        _this.showPopup("Error", "Ha ocurrido un error al crear la cuenta.");
                    }
                }, function (error) {
                    _this.loading.dismiss();
                    _this.showPopup("Error", error.error);
                });
            }
            else {
                this.createSuccess = false;
                this.showPopup("¡Lo sentimos!", "Debes aceptar las condiciones de uso");
            }
        }
        else {
            this.validateAllFormFields(this.registerUserForm);
            this.presentToast('¡Faltan datos para el registro!');
        }
    };
    ConfirmInfoPage.prototype.onValueChanged = function (data) {
        if (!this.registerUserForm) {
            return;
        }
        var form = this.registerUserForm;
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
    ConfirmInfoPage.prototype.validateAllFormFields = function (formGroup) {
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
    ConfirmInfoPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Registrando usuario...',
            spinner: 'ios',
            dismissOnPageChange: true
        });
        this.loading.present();
    };
    ConfirmInfoPage.prototype.showLoadingc = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Cargando...',
            spinner: 'ios'
        });
        this.loading.present();
    };
    ConfirmInfoPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.navCtrl.setRoot(TabsPage);
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    ConfirmInfoPage.prototype.presentToast = function (text) {
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
    ConfirmInfoPage = __decorate([
        Component({
            selector: 'page-confirm-info',
            templateUrl: 'confirm-info.html',
        }),
        __metadata("design:paramtypes", [NavController, AuthServiceProvider, NavParams, HttpClient, LoadingController, FormBuilder, AlertController, ToastController, RuteBaseProvider])
    ], ConfirmInfoPage);
    return ConfirmInfoPage;
}());
export { ConfirmInfoPage };
//# sourceMappingURL=confirm-info.js.map