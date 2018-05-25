import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { ConfirmInfoPage } from '../confirm-info/confirm-info';
import { TabsPage } from '../tabs/tabs';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect, TwitterConnectResponse } from '@ionic-native/twitter-connect';
import { Instagram } from "ng2-cordova-oauth/core";  
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';
import { OneSignal } from '@ionic-native/onesignal';
import { StorageProvider } from '../../providers/storage/storage';
import { EmailPasswordPage } from '../email-password/email-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  splash = false;
  user: any = {};
  loading: Loading;
  private apiResponse;
  public datos;
  public response;
  public loginUserForm: FormGroup;
  private oauth: OauthCordova = new OauthCordova();
  private instagramProvider: Instagram = new Instagram({
      clientId: "f5f12bb2777a4cafb05ee1398c1f5a90", 
      redirectUri: 'http://localhost',
      responseType: 'token',
      appScope: ['basic','public_content'] 
  });
  public apiuser = {
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private loadingCtrl: LoadingController, private facebook: Facebook, private twitter: TwitterConnect, public afAuth: AngularFireAuth, private builder: FormBuilder, public alertCtrl: AlertController, private auth: AuthServiceProvider,private oneSignal: OneSignal, public storage: StorageProvider) {
    this.apiResponse = [];
    this.initForm();
  }

  ionViewDidLoad() {
    //setTimeout(() => this.splash = false, 4000);
  }

  ionViewDidEnter() {  
    this.oneSignal.getIds().then((ids) => {
      this.storage.set('token_notificacion',ids.userId);
    });
  }

  initForm() {
    this.loginUserForm = this.builder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      token_notificacion: ['']
    });
  }

  register(){
  	this.navCtrl.push(RegisterPage);
  }

  //LOGIN
  login(){
    if (this.loginUserForm.valid) {
      this.showLoading('Iniciando sesión...');
      this.loginUserForm.patchValue({token_notificacion: this.storage.get('token_notificacion')});
      this.auth.login(this.loginUserForm.value).subscribe(allowed => {
        if (allowed) {        
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.loading.dismiss();
          this.showPopup("Error","Accesso Denegado");
        }
      },
      error => {
        this.loading.dismiss();
        this.showPopup("Error", error.error);
      });
    } else {
      this.showPopup("Error", "Por favor, verifica los datos");
    }
  }

  // LOGIN FACEBOOK
  loginFacebook(){
    this.facebook.login(['public_profile', 'email'])
    .then(rta => {
      if(rta.status == 'connected'){
        this.getInfoFacebook();
      };
    })
    .catch(error =>{
      this.showPopup('Error','Ha ocurrido un error al iniciar sesión con Facebook')
    });
  }

  getInfoFacebook(){
    this.facebook.api('/me?fields=id,name,email,picture.type(large)',['public_profile','email'])
    .then(data=>{
      this.showLoading('Cargando...');
      this.user = data;
      if (this.user.name != null || this.user.name != '') {
        this.apiuser.nombre = this.user.name;
      }
      if (this.user.email != null || this.user.email != '') {
        this.apiuser.email = this.user.email;
      }
      if (this.user.picture != null || this.user.picture != '') {
        this.apiuser.imagen = this.user.picture.data.url;
      }
      if (this.user.id != null || this.user.id != '') {
        this.apiuser.id_facebook = this.user.id;
      }
      this.apiuser.tipo_registro = 2;
      this.apiuser.token_notificacion = this.storage.get('token_notificacion');
      this.auth.loginSocial(this.apiuser).subscribe(allowed => {
        if (allowed) {        
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.loading.dismiss();
          this.showPopup("Error","Accesso Denegado");
        }
      },
      error => {
        this.apiuser.token_notificacion = this.storage.get('token_notificacion');
        this.navCtrl.push(ConfirmInfoPage, {user: this.apiuser});
      });
    })
    .catch(error =>{
      this.loading.dismiss();
      this.showPopup('Error','Ha ocurrido un error al iniciar sesión con Facebook')
    });
  }

  //LOGIN TWITTER
  loginTwitter(){
    this.showLoading('Cargando...');
    this.twitter.login()
    .then((response: TwitterConnectResponse) => {
      const twitterCredential = firebase.auth.TwitterAuthProvider.credential(response.token, response.secret);
      this.afAuth.auth.signInWithCredential(twitterCredential)
      .then(res => {
        this.user = res;
        if (this.user.displayName != null || this.user.displayName != '') {
          this.apiuser.nombre = this.user.displayName;
        }
        if (this.user.providerData[0].email != null || this.user.providerData[0].email != '') {
          this.apiuser.email = this.user.providerData[0].email;
        }
        if (this.user.photoURL != null || this.user.photoURL != '') {
          var picture = this.user.photoURL.replace("_normal","");
          this.apiuser.imagen = picture;
        }
        if (this.user.uid != null || this.user.uid != '') {
          this.apiuser.id_twitter = this.user.uid;
        }
        if (this.user.phoneNumber != null || this.user.phoneNumber != '') {
          this.apiuser.telefono = this.user.phoneNumber;
        }
        this.apiuser.tipo_registro = 3;
        this.apiuser.token_notificacion = this.storage.get('token_notificacion');
        this.auth.loginSocial(this.apiuser).subscribe(allowed => {
          if (allowed) {        
            this.navCtrl.setRoot(TabsPage);
          } else {
            this.loading.dismiss();
            this.showPopup("Error","Accesso Denegado");
          }
        },
        error => {
          this.apiuser.token_notificacion = this.storage.get('token_notificacion');
          this.navCtrl.push(ConfirmInfoPage, {user: this.apiuser});
        });
      })
      .catch((error) => {
        this.loading.dismiss();
        this.showPopup('Error','Ha ocurrido un error al iniciar sesión con Twitter 2')
      })
    })
    .catch((error) => {
        this.loading.dismiss();
        this.showPopup('Error','Ha ocurrido un error al iniciar sesión con Twitter')
    });
  }

  //LOGIN INSTAGRAM
  loginInstagram(){
    this.showLoading('Cargando...');
    this.oauth.logInVia(this.instagramProvider).then((success) => {
        this.loading.dismiss();
        this.response = success;
        this.http.get('https://api.instagram.com/v1/users/self/media/recent?access_token=' + this.response.access_token + '&count=5')
        .toPromise()
        .then(
        data => {
          this.datos = data;
          this.user = this.datos.data[0];
          if (this.user.user.full_name != null || this.user.user.full_name != '') {
            this.apiuser.nombre = this.user.user.full_name;
          }
          if (this.user.email != null || this.user.email != '') {
            this.apiuser.email = this.user.email;
          }
          if (this.user.user.profile_picture != null || this.user.user.profile_picture != '') {
            this.apiuser.imagen = this.user.user.profile_picture;
          }
          if (this.user.id != null || this.user.id != '') {
            this.apiuser.id_instagram = this.user.id;
          }
          this.apiuser.tipo_registro = 4;
          this.apiuser.token_notificacion = this.storage.get('token_notificacion');
          this.auth.loginSocial(this.apiuser).subscribe(allowed => {
            if (allowed) {        
              this.navCtrl.setRoot(TabsPage);
            } else {
              this.loading.dismiss();
              this.showPopup("Error","Accesso Denegado");
            }
          },
          error => {
            this.apiuser.token_notificacion = this.storage.get('token_notificacion');
            this.navCtrl.push(ConfirmInfoPage, {user: this.apiuser});
          });
        },
        msg => {
          this.loading.dismiss();
          this.showPopup('Error','Ha ocurrido un error al iniciar sesión con Instagram');
        });
    }, (error) => {
        this.loading.dismiss();
        this.showPopup('Error','Ha ocurrido un error al iniciar sesión con Instagram');
    });
  }

  forgetPassword(){
    this.navCtrl.push(EmailPasswordPage);
  }

  showLoading(text) {
    this.loading = this.loadingCtrl.create({
      content: text,
      spinner: 'ios',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            
          }
        }
      ]
    });
    alert.present();
  }

}
