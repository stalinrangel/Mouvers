import { Component } from '@angular/core';
import { NavController, NavParams, App, Loading, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { WayOrderPage } from '../way-order/way-order';
import { CartProvider } from '../../providers/cart/cart';
import { LoginPage } from '../login/login';


declare var OpenPay;

@Component({
  selector: 'page-form-openpay',
  templateUrl: 'form-openpay.html',
})
export class FormOpenpayPage {

	public paymentForm: FormGroup;
	public deviceSessionId: any;
	public total: any;
	public user: any = {};
	public datos: any;
	public items: any;
	public products: any[] = [];
	public delivery: any;
	public direction: any;
	public order = {
		lat: null,
		lng: null,
		direccion: null,
		distancia: null,
		tiempo: null,
		subtotal: null,
		costo: null,
		costo_envio: null,
		usuario_id: null,
		productos: null,
		ruta: null,
		token: null
	}
	formErrors = {
	    "card_number":"",
	    "holder_name":"",
	    "expiration_year":"",
	    "expiration_month":"",
	    "cvv2":""
	};
	public cargo = {
		"source_id" : "",
	   	"method" : "card",
	   	"amount" : 0,
	   	"currency" : "MXN",
	   	"description" : "compra en Mouvers",
	   	"device_session_id" : "",
	   	"customer" : {
        	"name" : "",
        	"last_name" : "",
        	"phone_number" : "",
        	"email" : ""
   		}
	}
	loading: Loading;
	tipos = {
		estado_pago: 'declinado',
		api_tipo_pago: 'TDD/TDC',
		token: this.storage.get('tokenMouver')
	}
	datos_id: any;

	constructor(public navCtrl: NavController, public app: App, public navParams: NavParams, private builder: FormBuilder, public storage: StorageProvider, private http: HttpClient, private rutebaseApi: RuteBaseProvider, public cartProvider: CartProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		OpenPay.setId('mar9y504wykxrxgisycl');
		OpenPay.setApiKey('pk_93f0da9550f54da1a5e393345004bb79');
		OpenPay.setSandboxMode(true);
		this.total = this.navParams.get('total');
		this.initForm();
		this.initOrder();
	}

	initForm() {
	    this.paymentForm = this.builder.group({
	      card_number: ['4111111111111111', [Validators.required, Validators.minLength(16), Validators.maxLength(19)]],
	      holder_name: ['Juan Perez Ramirez', [Validators.required]],
	      expiration_year: ['20', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
	      expiration_month: ['12', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
	      cvv2: ['110', [Validators.required, Validators.minLength(3)]]
	    });
	    this.paymentForm.valueChanges.subscribe(data => this.onValueChanged(data));
	    this.onValueChanged();
	    this.deviceSessionId = OpenPay.deviceData.setup(this.paymentForm.value);
		this.cargo.device_session_id = this.deviceSessionId;
		this.cargo.amount = parseFloat(this.total);
		this.user = this.storage.getObject('userMouver');
		this.cargo.customer.name = this.user.nombre;
		this.cargo.customer.phone_number = this.user.telefono;
		this.cargo.customer.email = this.user.email;
	}

	initOrder(){
		this.delivery = this.cartProvider.getDelivery();
		this.direction = this.cartProvider.getDireccion();
		this.order.lat = this.direction.lat;
		this.order.lng = this.direction.lng;
		this.order.direccion = this.direction.direccion;
		this.order.distancia = parseFloat(this.cartProvider.getDistance());
		this.order.tiempo = parseFloat(this.cartProvider.getDuration());
		this.order.subtotal = parseFloat(this.cartProvider.getCartSubTotal());
		this.order.costo = parseFloat(this.total);
		this.order.costo_envio = parseFloat(this.cartProvider.getDelivery());
		this.order.usuario_id = parseInt(this.cartProvider.getCartId());
		this.items = this.cartProvider.getCartContents();
		this.items.forEach((elem) => {
          this.products.push({producto_id: elem.id, cantidad: elem.cantidad, observacion: null, precio_unitario: elem.precio});
        });
        this.order.productos = JSON.stringify(this.products);
        this.order.ruta = JSON.stringify(this.cartProvider.getRoute());
        this.order.token = this.storage.get('tokenMouver');
	}

  	pagar(form){
  		console.log(this.order);
  		this.showLoading('Enviando pedido...');
		this.http.post(this.rutebaseApi.getRutaApi()+'pedidos', this.order)
		.toPromise()
		.then(
		data => {
			this.datos_id = data;
			var that = this;
			this.loading.setContent('Validando información...');
			OpenPay.token.create(form.value, function SuccessCallback(response) {
	    		that.cargo.source_id = response.data.id; 
	    		that.paymentCharge();
			}
			, function ErrorCallback(response) {
				this.http.delete(this.rutebaseApi.getRutaApi()+'pedidos/'+ this.datos_id.pedido.id + '?token='+ this.storage.get('tokenMouver'))
				.toPromise()
				.then(
				data => {
					this.presentToast('No hemos podido validar tu tarjeta, por favor verifica los datos')
					this.loading.dismiss();
				},
				msg => {
					this.loading.dismiss();
					if(msg.status == 400 || msg.status == 401){ 
		                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
		                this.app.getRootNav().setRoot(LoginPage);  
		            }
				});
			});
		},
		msg => {
			this.loading.dismiss();
			if(msg.status == 400 || msg.status == 401){ 
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo', 3000);
                this.app.getRootNav().setRoot(LoginPage);  
            } else {
            	this.presentToast(msg.error.error, 3000)
            }
		});	
	}

	paymentCharge(){
		this.loading.setContent('Generando el pago...');
		let headers = new HttpHeaders();
		headers = headers.append("Authorization", "Basic " + btoa('sk_a2e0e125d1e747cf80153d7876d2a47c' + ":"));
		headers = headers.append("Content-Type", "application/json");
		this.http.post('https://sandbox-api.openpay.mx/v1/mar9y504wykxrxgisycl/charges', this.cargo, {
            headers: headers
        })
	    .toPromise()
	    .then(
	      data => {
	        this.datos = data;
	        if (this.datos.status == 'completed') {
	        	this.tipos.estado_pago='aprobado';
	        	this.payment();
	        }
	      },
	      msg => {
	        this.http.delete(this.rutebaseApi.getRutaApi()+'pedidos/'+ this.datos_id.pedido.id + '?token='+ this.storage.get('tokenMouver'))
			.toPromise()
			.then(
			data => {
				this.presentToast('No hemos podido generar tu pago, por favor verifica los datos de tu tarjeta', 3000)
				this.loading.dismiss();
			},
			msg => {
				this.loading.dismiss();
				if(msg.status == 400 || msg.status == 401){ 
                	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo', 3000);
                	this.app.getRootNav().setRoot(LoginPage);  
	            } else {
	            	this.presentToast(msg.error.error, 3000)
	            }
			});
	    });
	}

	payment(){
		this.loading.setContent('Confirmando pago...');
		this.http.put(this.rutebaseApi.getRutaApi()+'pedidos/'+ this.datos_id.pedido.id, this.tipos)
		.toPromise()
		.then(
		data => {
			this.cartProvider.deleteCar();
			this.loading.dismiss();
			this.navCtrl.push(WayOrderPage, {pedido_id: this.datos_id.pedido.id});
		},
		msg => {
			this.loading.dismiss();
			if(msg.status == 400 || msg.status == 401){ 
            	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo', 3000);
            	this.app.getRootNav().setRoot(LoginPage);  
            } else {
            	this.presentToast(msg.error.error, 3000);
            }
		});
	}

	onValueChanged(data?: any) {
	    if (!this.paymentForm) { return; }
	    const form = this.paymentForm;

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

	showLoading(text) {
		this.loading = this.loadingCtrl.create({
	  		content: text,
	  		spinner: 'ios',
	  		duration: 20000
		});
		this.loading.present();
	}

	presentToast(text,time) {
	    let toast = this.toastCtrl.create({
	      message: text,
	      duration: time,
	      position: 'top'
	    });

	    toast.onDidDismiss(() => {
	      console.log('Dismissed toast');
	    });

	    toast.present();
	}

}
