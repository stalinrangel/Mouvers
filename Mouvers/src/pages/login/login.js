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
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { ConfirmInfoPage } from '../confirm-info/confirm-info';
import { TabsPage } from '../tabs/tabs';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';
import { OneSignal } from '@ionic-native/onesignal';
import { StorageProvider } from '../../providers/storage/storage';
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, http, loadingCtrl, facebook, twitter, afAuth, builder, alertCtrl, auth, oneSignal, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.facebook = facebook;
        this.twitter = twitter;
        this.afAuth = afAuth;
        this.builder = builder;
        this.alertCtrl = alertCtrl;
        this.auth = auth;
        this.oneSignal = oneSignal;
        this.storage = storage;
        this.splash = false;
        this.user = {};
        this.oauth = new OauthCordova();
        this.instagramProvider = new Instagram({
            clientId: "f5f12bb2777a4cafb05ee1398c1f5a90",
            redirectUri: 'http://localhost',
            responseType: 'token',
            appScope: ['basic', 'public_content']
        });
        this.apiuser = {
            nombre: '',
            email: null,
            imagen: 'assets/imgs/user-white.png',
            telefono: '',
            id_facebook: null,
            id_twitter: null,
            id_instagram: null,
            tipo_registro: 0,
            token_notificacion: ''
        };
        this.apiResponse = [];
        this.initForm();
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        //setTimeout(() => this.splash = false, 4000);
    };
    LoginPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.oneSignal.getIds().then(function (ids) {
            _this.storage.set('token_notificacion', ids.userId);
        });
    };
    LoginPage.prototype.initForm = function () {
        this.loginUserForm = this.builder.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
            token_notificacion: ['']
        });
    };
    LoginPage.prototype.register = function () {
        this.navCtrl.push(RegisterPage);
    };
    //LOGIN
    LoginPage.prototype.login = function () {
        var _this = this;
        if (this.loginUserForm.valid) {
            this.showLoading('Iniciando sesión...');
            this.loginUserForm.patchValue({ token_notificacion: this.storage.get('token_notificacion') });
            this.auth.login(this.loginUserForm.value).subscribe(function (allowed) {
                if (allowed) {
                    _this.navCtrl.setRoot(TabsPage);
                }
                else {
                    _this.loading.dismiss();
                    _this.showPopup("Error", "Accesso Denegado");
                }
            }, function (error) {
                _this.loading.dismiss();
                _this.showPopup("Error", error.error);
            });
        }
        else {
            this.showPopup("Error", "Por favor, verifica los datos");
        }
    };
    // LOGIN FACEBOOK
    LoginPage.prototype.loginFacebook = function () {
        var _this = this;
        this.facebook.login(['public_profile', 'email'])
            .then(function (rta) {
            if (rta.status == 'connected') {
                _this.getInfoFacebook();
            }
            ;
        })
            .catch(function (error) {
            _this.showPopup('Error', 'Ha ocurrido un error al iniciar sesión con Facebook');
        });
    };
    LoginPage.prototype.getInfoFacebook = function () {
        var _this = this;
        this.facebook.api('/me?fields=id,name,email,picture.type(large)', ['public_profile', 'email'])
            .then(function (data) {
            _this.showLoading('Cargando...');
            _this.user = data;
            if (_this.user.name != null || _this.user.name != '') {
                _this.apiuser.nombre = _this.user.name;
            }
            if (_this.user.email != null || _this.user.email != '') {
                _this.apiuser.email = _this.user.email;
            }
            if (_this.user.picture != null || _this.user.picture != '') {
                _this.apiuser.imagen = _this.user.picture.data.url;
            }
            if (_this.user.id != null || _this.user.id != '') {
                _this.apiuser.id_facebook = _this.user.id;
            }
            _this.apiuser.tipo_registro = 2;
            _this.apiuser.token_notificacion = _this.storage.get('token_notificacion');
            _this.auth.loginSocial(_this.apiuser).subscribe(function (allowed) {
                if (allowed) {
                    _this.navCtrl.setRoot(TabsPage);
                }
                else {
                    _this.loading.dismiss();
                    _this.showPopup("Error", "Accesso Denegado");
                }
            }, function (error) {
                _this.apiuser.token_notificacion = _this.storage.get('token_notificacion');
                _this.navCtrl.push(ConfirmInfoPage, { user: _this.apiuser });
            });
        })
            .catch(function (error) {
            _this.loading.dismiss();
            _this.showPopup('Error', 'Ha ocurrido un error al iniciar sesión con Facebook');
        });
    };
    //LOGIN TWITTER
    LoginPage.prototype.loginTwitter = function () {
        var _this = this;
        this.showLoading('Cargando...');
        this.twitter.login()
            .then(function (response) {
            var twitterCredential = firebase.auth.TwitterAuthProvider.credential(response.token, response.secret);
            _this.afAuth.auth.signInWithCredential(twitterCredential)
                .then(function (res) {
                _this.user = res;
                if (_this.user.displayName != null || _this.user.displayName != '') {
                    _this.apiuser.nombre = _this.user.displayName;
                }
                if (_this.user.providerData[0].email != null || _this.user.providerData[0].email != '') {
                    _this.apiuser.email = _this.user.providerData[0].email;
                }
                if (_this.user.photoURL != null || _this.user.photoURL != '') {
                    var picture = _this.user.photoURL.replace("_normal", "");
                    _this.apiuser.imagen = picture;
                }
                if (_this.user.uid != null || _this.user.uid != '') {
                    _this.apiuser.id_twitter = _this.user.uid;
                }
                if (_this.user.phoneNumber != null || _this.user.phoneNumber != '') {
                    _this.apiuser.telefono = _this.user.phoneNumber;
                }
                _this.apiuser.tipo_registro = 3;
                _this.apiuser.token_notificacion = _this.storage.get('token_notificacion');
                _this.auth.loginSocial(_this.apiuser).subscribe(function (allowed) {
                    if (allowed) {
                        _this.navCtrl.setRoot(TabsPage);
                    }
                    else {
                        _this.loading.dismiss();
                        _this.showPopup("Error", "Accesso Denegado");
                    }
                }, function (error) {
                    _this.apiuser.token_notificacion = _this.storage.get('token_notificacion');
                    _this.navCtrl.push(ConfirmInfoPage, { user: _this.apiuser });
                });
            })
                .catch(function (error) {
                _this.loading.dismiss();
                _this.showPopup('Error', 'Ha ocurrido un error al iniciar sesión con Twitter 2');
            });
        })
            .catch(function (error) {
            _this.loading.dismiss();
            _this.showPopup('Error', 'Ha ocurrido un error al iniciar sesión con Twitter');
        });
    };
    //LOGIN INSTAGRAM
    LoginPage.prototype.loginInstagram = function () {
        var _this = this;
        this.showLoading('Cargando...');
        this.oauth.logInVia(this.instagramProvider).then(function (success) {
            _this.loading.dismiss();
            _this.response = success;
            _this.http.get('https://api.instagram.com/v1/users/self/media/recent?access_token=' + _this.response.access_token + '&count=5')
                .toPromise()
                .then(function (data) {
                _this.datos = data;
                _this.user = _this.datos.data[0];
                if (_this.user.user.full_name != null || _this.user.user.full_name != '') {
                    _this.apiuser.nombre = _this.user.user.full_name;
                }
                if (_this.user.email != null || _this.user.email != '') {
                    _this.apiuser.email = _this.user.email;
                }
                if (_this.user.user.profile_picture != null || _this.user.user.profile_picture != '') {
                    _this.apiuser.imagen = _this.user.user.profile_picture;
                }
                if (_this.user.id != null || _this.user.id != '') {
                    _this.apiuser.id_instagram = _this.user.id;
                }
                _this.apiuser.tipo_registro = 4;
                _this.apiuser.token_notificacion = _this.storage.get('token_notificacion');
                _this.auth.loginSocial(_this.apiuser).subscribe(function (allowed) {
                    if (allowed) {
                        _this.navCtrl.setRoot(TabsPage);
                    }
                    else {
                        _this.loading.dismiss();
                        _this.showPopup("Error", "Accesso Denegado");
                    }
                }, function (error) {
                    _this.apiuser.token_notificacion = _this.storage.get('token_notificacion');
                    _this.navCtrl.push(ConfirmInfoPage, { user: _this.apiuser });
                });
            }, function (msg) {
                _this.loading.dismiss();
                _this.showPopup('Error', 'Ha ocurrido un error al iniciar sesión con Instagram');
            });
        }, function (error) {
            _this.loading.dismiss();
            _this.showPopup('Error', 'Ha ocurrido un error al iniciar sesión con Instagram');
        });
    };
    LoginPage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios',
            dismissOnPageChange: true
        });
        this.loading.present();
    };
    LoginPage.prototype.showPopup = function (title, text) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                    }
                }
            ]
        });
        alert.present();
    };
    LoginPage = __decorate([
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, HttpClient, LoadingController, Facebook, TwitterConnect, AngularFireAuth, FormBuilder, AlertController, AuthServiceProvider, OneSignal, StorageProvider])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map