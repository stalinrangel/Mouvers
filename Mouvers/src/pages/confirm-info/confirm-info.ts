import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-confirm-info',
  templateUrl: 'confirm-info.html',
})
export class ConfirmInfoPage {

	user: any = {};
	loading: Loading;
  public city: string = 'Ciudad';
  public registerUserForm: FormGroup;
	public estados: any;
	public ciudades: any = [];
	public datos: any;
	public createSuccess: boolean = false;
	formErrors = {
		'nombre': '',
		'telefono': '',
		'email': '',
		'ciudad': '',
		'estado': ''
	};

	constructor(public navCtrl: NavController, private auth: AuthServiceProvider, public navParams: NavParams, private http: HttpClient, private loadingCtrl: LoadingController, private builder: FormBuilder, public alertCtrl: AlertController, private toastCtrl: ToastController, private rutebaseApi: RuteBaseProvider) {
		this.user = navParams.get('user');
		this.initForm();
	}

	initForm() {
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

  register(){
    this.registerUserForm.value.email = this.registerUserForm.value.email.toLowerCase();
    if (this.registerUserForm.valid) {
      if (this.registerUserForm.value.check) {
        this.showLoading();
        this.auth.registerSocial(this.registerUserForm.value).subscribe(
          success => {
            if (success) {
              this.loading.dismiss();
              this.createSuccess = true;
              this.showPopup("Completado", "Usuario registrado con éxito.");
            } else {
              this.showPopup("Error", "Ha ocurrido un error al crear la cuenta.");
            }
          },
          error => {
            this.loading.dismiss();
            this.showPopup("Error", error.error);
          }
        );
      } else {
        this.createSuccess = false;
        this.showPopup("¡Lo sentimos!", "Debes aceptar las condiciones de uso");
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
      content: 'Registrando usuario...',
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
              this.navCtrl.setRoot(TabsPage);
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
