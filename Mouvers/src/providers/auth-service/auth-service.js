var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StorageProvider } from '../storage/storage';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
var AuthServiceProvider = /** @class */ (function () {
    function AuthServiceProvider(http, storage, rutebaseAPI) {
        this.http = http;
        this.storage = storage;
        this.rutebaseAPI = rutebaseAPI;
    }
    AuthServiceProvider.prototype.login = function (credentials) {
        var _this = this;
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        }
        else {
            return Observable.create(function (observer) {
                _this.http.post(_this.rutebaseAPI.getRutaApi() + 'login/app', credentials)
                    .toPromise()
                    .then(function (data) {
                    _this.usuario = data;
                    _this.storage.set('tokenMouver', _this.usuario.token);
                    _this.storage.setObject('userMouver', _this.usuario.user);
                    observer.next(true);
                    observer.complete();
                }, function (msg) {
                    observer.error(msg.error);
                    observer.complete();
                });
            });
        }
    };
    AuthServiceProvider.prototype.loginSocial = function (credentials) {
        var _this = this;
        if (credentials.email === null) {
            return Observable.throw("Please insert credentials");
        }
        else {
            return Observable.create(function (observer) {
                _this.http.post(_this.rutebaseAPI.getRutaApi() + 'login/app', credentials)
                    .toPromise()
                    .then(function (data) {
                    _this.usuario = data;
                    _this.storage.set('tokenMouver', _this.usuario.token);
                    _this.storage.setObject('userMouver', _this.usuario.user);
                    observer.next(true);
                    observer.complete();
                }, function (msg) {
                    observer.error(msg.error);
                    observer.complete();
                });
            });
        }
    };
    AuthServiceProvider.prototype.registerSocial = function (credentials) {
        var _this = this;
        if (credentials.nombre === null || credentials.telefono === null || credentials.email === null || credentials.ciudad === null || credentials.estado === null) {
            return Observable.throw("Please insert credentials");
        }
        else {
            return Observable.create(function (observer) {
                _this.http.post(_this.rutebaseAPI.getRutaApi() + 'usuarios', credentials)
                    .toPromise()
                    .then(function (data) {
                    _this.usuario = data;
                    _this.storage.set('tokenMouver', _this.usuario.token);
                    _this.storage.setObject('userMouver', _this.usuario.usuario);
                    observer.next(true);
                    observer.complete();
                }, function (msg) {
                    observer.error(msg.error);
                    observer.complete();
                });
            });
        }
    };
    AuthServiceProvider.prototype.register = function (credentials) {
        var _this = this;
        if (credentials.nombre === null || credentials.telefono === null || credentials.email === null || credentials.password === null || credentials.ciudad === null || credentials.estado === null || credentials.rpassword === null) {
            return Observable.throw("Please insert credentials");
        }
        else {
            return Observable.create(function (observer) {
                _this.http.post(_this.rutebaseAPI.getRutaApi() + 'usuarios', credentials)
                    .toPromise()
                    .then(function (data) {
                    observer.next(true);
                    observer.complete();
                }, function (msg) {
                    observer.error(msg.error);
                    observer.complete();
                });
            });
        }
    };
    AuthServiceProvider.prototype.getUserInfo = function () {
        return this.storage.getObject('userMouver');
    };
    AuthServiceProvider.prototype.logout = function () {
        return Observable.create(function (observer) {
            observer.next(true);
            observer.complete();
        });
    };
    AuthServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, StorageProvider, RuteBaseProvider])
    ], AuthServiceProvider);
    return AuthServiceProvider;
}());
export { AuthServiceProvider };
//# sourceMappingURL=auth-service.js.map