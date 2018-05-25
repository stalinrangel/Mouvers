import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	password_type1: string = 'password';
	password_type2: string = 'password';
  city: string = 'Ciudad';
  public registerUserForm: FormGroup;
  public estados: any;
  public ciudades: any = [];
  public datos: any;
  public createSuccess: boolean = false;
  loading: Loading;
  formErrors = {
    'nombre': '',
    'telefono': '',
    'email': '',
    'ciudad': '',
    'estado': '',
    'password': '',
    'rpassword': ''
  };

	constructor(public navCtrl: NavController, public http: HttpClient, private auth: AuthServiceProvider, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private builder: FormBuilder, private toastCtrl: ToastController, public rutebaseApi: RuteBaseProvider, public storage: StorageProvider) {
	  this.initForm();
  }

  initForm() {
    this.registerUserForm = this.builder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      tipo_usuario: [2],
      tipo_registro: [1],
      ciudad: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      imagen: ['http://mouvers.mx/terminos/imgs/user-white.png'],
      password: ['', [Validators.required]],
      rpassword: ['', [Validators.required]],
      check: [false],
      token_notificacion: ['']
    });
    this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.page();
  }

  page(){
    this.showLoadingc();
    this.http.get(this.rutebaseApi.getRutaApi() + 'entidades/municipios')
    .toPromise()
    .then(
      data => {
        this.datos = data;
        this.estados = this.datos.entidades;
        this.registerUserForm.patchValue({estado: this.estados[0].nom_ent}); 
        this.setEstado(this.estados[0].nom_ent);
        this.loading.dismiss();
      },
      msg => {
        this.presentToast('No se pudo cargar los estados y ciudades, intenta de nuevo');
        this.loading.dismiss();
    });
  }

  setEstado(estado){
    for (var i = 0; i < this.estados.length; ++i) {
      if (estado == this.estados[i].nom_ent) {
        this.ciudades = this.estados[i].municipios;
        this.registerUserForm.patchValue({ciudad: this.estados[i].municipios[0].nom_mun});
      }
    }
    if (estado === 'Ciudad de México') {
      this.city = 'Delegación';
    } else {
      this.city = 'Ciudad';
    }
  }
	
  togglePasswordMode1() {   
	   this.password_type1 = this.password_type1 === 'text' ? 'password' : 'text';
	}

	togglePasswordMode2() {   
	   this.password_type2 = this.password_type2 === 'text' ? 'password' : 'text';
	}

  register(){
    this.registerUserForm.value.email = this.registerUserForm.value.email.toLowerCase();
    this.registerUserForm.patchValue({token_notificacion: this.storage.get('token_notificacion')});
    if (this.registerUserForm.valid) {
      if (this.registerUserForm.value.password !== this.registerUserForm.value.rpassword) {
        this.presentToast("¡Lo sentimos!, Contraseñas no coinciden");
      } else {
        if (this.registerUserForm.value.check) {
          this.showLoading();
          this.auth.register(this.registerUserForm.value).subscribe(
            success => {
              if (success) {
                this.loading.dismiss();
                this.createSuccess = true;
                this.showPopup("Completado", 'Revisa la bandeja de entrada de tu correo electrónico para validar tu cuenta y así poder disfrutar nuestros servicios.');
              } else {
                this.presentToast("Ha ocurrido un error al crear la cuenta.");
              }
            },
            error => {
              this.loading.dismiss();
              this.showPopup("Error", error.error);
            }
          );
        } else {
          this.createSuccess = false;
          this.presentToast("¡Lo sentimos!, Debes aceptar las condiciones de uso");
        }
      }
    } else {
      this.validateAllFormFields(this.registerUserForm);
      this.presentToast('¡Faltan datos para el registro!');
    }
  }

  onValueChanged(data?: any) {
    if (!this.registerUserForm) { return; }
    const form = this.registerUserForm;

    for (const field in this.formErrors) { 
      const control = form.get(field);
      this.formErrors[field] = '';
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors[field] += true;
          console.log(key);
        }
      } 
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf:true });
        this.onValueChanged();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Registrando Usuario...',
      spinner: 'ios',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showLoadingc() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...',
      spinner: 'ios'
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
            if (this.createSuccess) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
