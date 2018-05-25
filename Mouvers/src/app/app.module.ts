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
import { EmailPasswordPage } from '../pages/email-password/email-password';
import { CodepasswordPage } from '../pages/codepassword/codepassword';
import { ContrasenaPage } from '../pages/contrasena/contrasena';
import { ChatSupportPage } from '../pages/chat-support/chat-support';

import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { PayPal } from '@ionic-native/paypal';
import { OneSignal } from '@ionic-native/onesignal';

import { AngularFireModule } from 'angularfire2' ;
import { AngularFireAuthModule , AngularFireAuth } from 'angularfire2/auth' ;
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
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { RelativeTimePipe } from '../pipes/relative-time/relative-time';

@NgModule({
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
    CalificationPage,
    EmailPasswordPage,
    CodepasswordPage,
    ContrasenaPage,
    ChatSupportPage,
    RelativeTimePipe
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
    CalificationPage,
    EmailPasswordPage,
    CodepasswordPage,
    ContrasenaPage,
    ChatSupportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    TwitterConnect,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
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
    Transfer,
    ChatServiceProvider
  ]
})
export class AppModule {}
