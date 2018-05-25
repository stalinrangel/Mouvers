var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ConfirmInfoPage } from '../pages/confirm-info/confirm-info';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProductsPage } from '../pages/products/products';
import { ListCartPage } from '../pages/list-cart/list-cart';
import { MapPage } from '../pages/map/map';
import { PaymentsPage } from '../pages/payments/payments';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { StatusOrderPage } from '../pages/status-order/status-order';
import { WayOrderPage } from '../pages/way-order/way-order';
import { FormOpenpayPage } from '../pages/form-openpay/form-openpay';
import { CalificationPage } from '../pages/calification/calification';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { PayPal } from '@ionic-native/paypal';
import { OneSignal } from '@ionic-native/onesignal';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { StorageProvider } from '../providers/storage/storage';
import { CartProvider } from '../providers/cart/cart';
import { RuteBaseProvider } from '../providers/rute-base/rute-base';
import { LocationsProvider } from '../providers/locations/locations';
import { Ionic2RatingModule } from 'ionic2-rating';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { Transfer } from '@ionic-native/transfer';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                AboutPage,
                ContactPage,
                HomePage,
                TabsPage,
                LoginPage,
                RegisterPage,
                ConfirmInfoPage,
                ProductsPage,
                ListCartPage,
                MapPage,
                PaymentsPage,
                EditProfilePage,
                StatusOrderPage,
                WayOrderPage,
                FormOpenpayPage,
                CalificationPage
            ],
            imports: [
                BrowserModule,
                HttpClientModule,
                ReactiveFormsModule,
                AngularFireModule.initializeApp(environment.firebase),
                AngularFireAuthModule,
                Ionic2RatingModule,
                IonicModule.forRoot(MyApp, {
                    tabsPlacement: 'bottom',
                    backButtonText: ''
                })
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                AboutPage,
                ContactPage,
                HomePage,
                TabsPage,
                LoginPage,
                RegisterPage,
                ConfirmInfoPage,
                ProductsPage,
                ListCartPage,
                MapPage,
                PaymentsPage,
                EditProfilePage,
                StatusOrderPage,
                WayOrderPage,
                FormOpenpayPage,
                CalificationPage
            ],
            providers: [
                StatusBar,
                SplashScreen,
                Facebook,
                TwitterConnect,
                AngularFireAuth,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                AuthServiceProvider,
                StorageProvider,
                CartProvider,
                Geolocation,
                RuteBaseProvider,
                LocationsProvider,
                PayPal,
                OneSignal,
                Camera,
                File,
                FilePath,
                Transfer
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map