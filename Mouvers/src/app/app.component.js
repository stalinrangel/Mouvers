var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { CalificationPage } from '../pages/calification/calification';
import { StorageProvider } from '../providers/storage/storage';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, storage) {
        var _this = this;
        this.storage = storage;
        this.rootPage = LoginPage;
        var item = this.storage.get('tokenMouver');
        if (item !== null && item !== "") {
            this.rootPage = TabsPage;
        }
        else {
            this.rootPage = LoginPage;
        }
        platform.ready().then(function () {
            statusBar.styleLightContent();
            splashScreen.hide();
            var that = _this;
            var notificationOpenedCallback = function (jsonData) {
                if (jsonData.notification.payload.additionalData.accion == 1) {
                    that.aceptOrder(jsonData.notification.payload.additionalData.pedido_id);
                }
            };
            /*window["plugins"].OneSignal
            .startInit("a7bcda25-c861-45c6-9690-7f9ea76c92b7", "865044191010")
            .handleNotificationOpened(notificationOpenedCallback)
            .handleNotificationReceived(notificationOpenedCallback)
            .endInit();*/
        });
    }
    MyApp.prototype.aceptOrder = function (pedido) {
        this.storage.set('pedido_idMouver', pedido);
        this.nav.push(CalificationPage);
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform, StatusBar, SplashScreen, StorageProvider])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map