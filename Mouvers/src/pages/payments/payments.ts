import { Component } from '@angular/core';
import { NavController, App, NavParams, ToastController, LoadingController, Loading } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { WayOrderPage } from '../way-order/way-order';
import { FormOpenpayPage } from '../form-openpay/form-openpay';
import { StorageProvider } from '../../providers/storage/storage'
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
})
export class PaymentsPage {

	public subtotal: string;
	public delivery: any;
	public total: any;
	public address: string;
	public items: any;
	public products: any[] = [];
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
	loading: Loading;
	payPalEnvironmentSandbox = 'AfvDVr_ztoOb_x3ba7OWyjJ1tPrP5_n5fruoTSU2dizPJiFcpT1ZGtaPRYmL1Ra-MtRHzh2-_nGqDfGI';
	payPalEnvironmentProduction = '';
	payPalEnvironment: string = 'payPalEnvironmentSandbox';
	payment: PayPalPayment;
	currencies = ['MXN'];
	tipos = {
		estado_pago: 'Aprobado',
		api_tipo_pago: 'PayPal',
		token: this.storage.get('tokenMouver')
	}
	datos: any;
	datos_id: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public cartProvider: CartProvider, private paypal: PayPal, public http: HttpClient, public rutebaseAPI: RuteBaseProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, public app: App) {
	}

	initOrder(total, subtotal){
		let direction = this.cartProvider.getDireccion();
		this.order.lat = direction.lat;
		this.order.lng = direction.lng;
		this.order.direccion = direction.direccion;
		this.order.distancia = parseFloat(this.cartProvider.getDistance());
		this.order.tiempo = parseFloat(this.cartProvider.getDuration());
		this.order.subtotal = subtotal;
		this.order.costo = total;
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

	ionViewWillEnter() {
		this.subtotal = this.cartProvider.getCartSubTotal();
		this.delivery = this.cartProvider.getDelivery();
		this.total = (parseFloat(this.subtotal) + parseFloat(this.delivery)).toFixed(2);
		this.initOrder(this.total, this.subtotal);
	}

	payments(){
		if (this.order.costo_envio > 0) {
			this.payment = new PayPalPayment(this.total, 'MXN', 'Compra Mouvers', 'sale');
			this.showLoading('Enviando pedido...');
			this.http.post(this.rutebaseAPI.getRutaApi()+'pedidos', this.order)
			.toPromise()
			.then(
			data => {
				this.datos = data;
				this.datos_id = data;
				this.paypal.init({
					PayPalEnvironmentProduction: this.payPalEnvironmentProduction,
					PayPalEnvironmentSandbox: this.payPalEnvironmentSandbox
				}).then(() => {
					this.paypal.prepareToRender(this.payPalEnvironment, new PayPalConfiguration({})).then(() => {
						this.paypal.renderSinglePaymentUI(this.payment).then((response) => {
							if (response.response.state === 'approved') {
								this.updateOrder();
							} else {
								this.presentToast('Ha ocurrido un error en Paypal, por favor intenta de nuevo.')
								this.http.delete(this.rutebaseAPI.getRutaApi()+'pedidos/'+ this.datos_id.pedido.id + '?token='+ this.storage.get('tokenMouver'))
								.toPromise()
								.then(
								data => {
									this.loading.dismiss();
								},
								msg => {
									this.loading.dismiss();
									if(msg.status == 400 || msg.status == 401){ 
					                	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
					                	this.app.getRootNav().setRoot(LoginPage);  
						            } else {
						            	this.presentToast(msg.error.error)
						            }
								});
							}
						}, () => {
							this.presentToast('El cuadro de diálogo generó un error o se cerró sin éxito.')
							this.http.delete(this.rutebaseAPI.getRutaApi()+'pedidos/'+ this.datos_id.pedido.id + '?token='+ this.storage.get('tokenMouver'))
							.toPromise()
							.then(
							data => {
								this.loading.dismiss();
							},
							msg => {
								this.loading.dismiss();
								if(msg.status == 400 || msg.status == 401){ 
				                	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
				                	this.app.getRootNav().setRoot(LoginPage);  
					            } else {
					            	this.presentToast(msg.error.error)
					            }
							});
						});
					}, () => {
						this.presentToast('Error en configuración')
						this.http.delete(this.rutebaseAPI.getRutaApi()+'pedidos/'+ this.datos_id.pedido.id + '?token='+ this.storage.get('tokenMouver'))
						.toPromise()
						.then(
						data => {
							this.loading.dismiss();
						},
						msg => {
							this.loading.dismiss();
							if(msg.status == 400 || msg.status == 401){ 
			                	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
			                	this.app.getRootNav().setRoot(LoginPage);  
				            } else {
				            	this.presentToast(msg.error.error)
				            }
						});
					});
				}, () => {
					this.presentToast('Error en la inicialización, tal vez PayPal no es compatible o algo más')
					this.http.delete(this.rutebaseAPI.getRutaApi()+'pedidos/'+ this.datos_id.pedido.id + '?token='+ this.storage.get('tokenMouver'))
					.toPromise()
					.then(
					data => {
						this.loading.dismiss();
					},
					msg => {
						this.loading.dismiss();
						if(msg.status == 400 || msg.status == 401){ 
		                	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
		                	this.app.getRootNav().setRoot(LoginPage);  
			            } else {
			            	this.presentToast(msg.error.error)
			            }
					});
				});
			},
			msg => {
				this.loading.dismiss();
				if(msg.status == 400 || msg.status == 401){ 
	            	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
	            	this.app.getRootNav().setRoot(LoginPage);  
	            } else {
	            	this.presentToast(msg.error.error)
	            }
			});
		} else {
			this.presentToast('Ha ocurrido un error, por favor intenta mas tarde');
		}
	}

	updateOrder(){
		this.loading.setContent('Confirmando pago...');
		this.http.put(this.rutebaseAPI.getRutaApi()+'pedidos/'+ this.datos.pedido.id, this.tipos)
		.toPromise()
		.then(
		data => {
			this.cartProvider.deleteCar();
			this.loading.dismiss();
			this.navCtrl.push(WayOrderPage, {pedido_id: this.datos.pedido.id});
		},
		msg => {
			this.loading.dismiss();
			if(msg.status == 400 || msg.status == 401){ 
            	this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
            	this.app.getRootNav().setRoot(LoginPage);  
            } else {
            	this.presentToast(msg.error.error)
            }
		});
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

	openpay(){
		if (this.order.costo_envio > 0) {
			this.navCtrl.push(FormOpenpayPage, {total: this.total});
		} else {
			this.presentToast('Ha ocurrido un error, por favor intenta mas tarde');
		}
	}

	showLoading(text) {
		this.loading = this.loadingCtrl.create({
	  		content: text,
	  		spinner: 'ios',
	  		duration: 20000
		});
		this.loading.present();
	}

}
