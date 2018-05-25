import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ContrasenaPage } from '../contrasena/contrasena';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';

@Component({
  selector: 'page-codepassword',
  templateUrl: 'codepassword.html',
})
export class CodepasswordPage {
	loading: Loading;
 	CodepasswordForm: FormGroup;
	formErrors = {
		'codigo': ''
	};
	validationMessages = {
		'codigo': {
	      'required': 'El código de verificacion es requerido.'
	    }
	};
	public correo:any;
	public id: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private loadingCtrl: LoadingController, private builder: FormBuilder, public rutebaseAPI: RuteBaseProvider, private toastCtrl: ToastController) {
		this.correo = navParams.get('email');
		this.CodepasswordForm = this.builder.group({
	      codigo: ['', [Validators.required]]
	    });

	    this.CodepasswordForm.valueChanges.subscribe(data => this.onValueChanged(data));
	    this.onValueChanged();
	}

	codePassword(){
		if (this.CodepasswordForm.valid) {
	    	this.showLoading();
			this.http.get(this.rutebaseAPI.getRutaApi()+'password/codigo/'+this.CodepasswordForm.value.codigo)
    		.toPromise()
    		.then(
    			data => {
    				this.id = data;
					this.loading.dismiss();
					this.navCtrl.push(ContrasenaPage, {id_cliente: this.id.cliente_id, token: this.id.token});
    			},
    			msg => {
    				let err = msg.error;
    				this.loading.dismiss();
    				this.presentToast(err.error);
    			});
	    } else {
	      this.validateAllFormFields(this.CodepasswordForm);
	    }
	}

	solicitar(){
		this.navCtrl.pop();
	}
	
	showLoading() {
	    this.loading = this.loadingCtrl.create({
	      content: 'Verificando código...',
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

	onValueChanged(data?: any) {
		if (!this.CodepasswordForm) { return; }
		const form = this.CodepasswordForm;

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
}
