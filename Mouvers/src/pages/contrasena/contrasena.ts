import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';

@Component({
  selector: 'page-contrasena',
  templateUrl: 'contrasena.html',
})
export class ContrasenaPage {
	loading: Loading;
	updateSuccess: boolean = false;
	id_cliente: number;
	UpdatePassword: FormGroup;
	formErrors = {
		'password': '',
		'rpassword': '',
		'token': ''
	};
	validationMessages = {
		'password': {
		  'required': 'La contraseña es requerida.',
		  'minlength': 'La contraseña debe contener un mínimo de 8 caracteres.'
		},
		'rpassword': {
		  'required': 'El confirmar contraseña es requerido.',
		  'minlength': 'La contraseña debe contener un mínimo de 8 caracteres.'
		}
	};

	constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public http: HttpClient, private loadingCtrl: LoadingController, private builder: FormBuilder, public rutebaseAPI: RuteBaseProvider) {
		this.id_cliente = navParams.get('id_cliente');
		this.UpdatePassword = this.builder.group({
	      password: ['', [Validators.required, Validators.minLength(8)]],
	      rpassword: ['', [Validators.required, Validators.minLength(8)]],
	      token: [navParams.get('token')]
	    });

	    this.UpdatePassword.valueChanges.subscribe(data => this.onValueChanged(data));
	    this.onValueChanged();
	}

	updatePassword(){
		if (this.UpdatePassword.valid) {
	    	if (this.UpdatePassword.value.password !== this.UpdatePassword.value.rpassword) {
		      this.presentToast("Contraseñas no coinciden")
		    } else {
				this.showLoading();
				this.http.put(this.rutebaseAPI.getRutaApi()+'usuarios/'+this.id_cliente, this.UpdatePassword.value)
	    		.toPromise()
	    		.then(
	    			data => {
	    				this.loading.dismiss();
	    				this.navCtrl.setRoot(LoginPage);
	    			},
	    			msg => {
	    				let err = msg.error;
	    				this.loading.dismiss();
	    				this.presentToast(err.error);
	    			});
		    }
	    } else {
	      this.validateAllFormFields(this.UpdatePassword);
	    }
	}
	
	onValueChanged(data?: any) {
		if (!this.UpdatePassword) { return; }
		const form = this.UpdatePassword;

		for (const field in this.formErrors) { 
		  const control = form.get(field);
		  this.formErrors[field] = '';
		  if (control && control.dirty && !control.valid) {
		    const messages = this.validationMessages[field];
		    for (const key in control.errors) {
		      this.formErrors[field] += messages[key] + ' ';
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
	      content: 'Actualizando contraseña...',
	      spinner: 'ios',
	      dismissOnPageChange: true
	    });
	    this.loading.present();
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
