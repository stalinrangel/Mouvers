import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../services/ruta-base/ruta-base.service';

import { FormBuilder, FormArray, FormGroup, Validators  } from '@angular/forms';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sistema',
  styleUrls: ['./sistema.component.scss'],
  templateUrl: './sistema.component.html',
})

export class SistemaComponent implements OnInit{

	//----Alertas---<
	config: ToasterConfig;

	position = 'toast-top-right';
	animationType = 'fade';
	title = 'HI there!';
	content = `I'm cool toaster!`;
	timeout = 5000;
	toastsLimit = 5;
	type = 'default'; // 'default', 'info', 'success', 'warning', 'error'

	isNewestOnTop = true;
	isHideOnClick = true;
	isDuplicatesPrevented = false;
	isCloseButton = true;
	//----Alertas--->

	private data:any;
	public loading = false;

	public sistConfigurado=false;
	public idVarSistema:any;
	public costoxkm:any;

	constructor( private modalService: NgbModal,
	       private toasterService: ToasterService,
	       private http: HttpClient,
	       private router: Router,
	       private rutaService: RutaBaseService,
	       public fb: FormBuilder)
	{


	}


	ngOnInit() {

		this.loading = true;
		this.http.get(this.rutaService.getRutaApi()+'sistema?token='+localStorage.getItem('mouvers_token'))
		   .toPromise()
		   .then(
		     data => { // Success
		       console.log(data);
		       this.data=data;
		       this.idVarSistema=this.data.varSistema.id;
		       this.costoxkm=this.data.varSistema.costoxkm;

		       this.loading = false;
		       this.sistConfigurado = true;


		     },
		     msg => { // Error
		       console.log(msg);
		       //console.log(msg.error.error);

		       this.loading = false;

		       //token invalido/ausente o token expiro
		       if(msg.status == 400 || msg.status == 401){ 
		            //alert(msg.error.error);
		            this.showToast('warning', 'Warning!', msg.error.error);
		            setTimeout(()=>{
	                  this.router.navigateByUrl('/pagessimples/loginf');
	                },1000);
		        }
		        //sin usuarios
		        else if(msg.status == 404){ 
		            //alert(msg.error.error);
		            this.showToast('info', 'Info!', msg.error.error);
		        }
		        

		     }
		   );
	}

	private showToast(type: string, title: string, body: string) {
	  this.config = new ToasterConfig({
	    positionClass: this.position,
	    timeout: this.timeout,
	    newestOnTop: this.isNewestOnTop,
	    tapToDismiss: this.isHideOnClick,
	    preventDuplicates: this.isDuplicatesPrevented,
	    animation: this.animationType,
	    limit: this.toastsLimit,
	  });
	  const toast: Toast = {
	    type: type,
	    title: title,
	    body: body,
	    timeout: this.timeout,
	    showCloseButton: this.isCloseButton,
	    bodyOutputType: BodyOutputType.TrustedHtml,
	  };
	  this.toasterService.popAsync(toast);
	}

	configurarSist() {
		if (!this.sistConfigurado) {
			this.crearVarSist();
		}else{
			this.actualizarVarSist();
		}
	}

	crearVarSist() {

		this.loading = true;

		var datos= {
	        token: localStorage.getItem('mouvers_token'),
	        costoxkm: this.costoxkm,
	      }
	    console.log(datos);

		this.http.post(this.rutaService.getRutaApi()+'sistema', datos)
		   .toPromise()
		   .then(
		     data => { // Success
		       console.log(data);
		       this.data = data;

		       this.idVarSistema=this.data.varSistema.id;
		       this.costoxkm=this.data.varSistema.costoxkm;

		       this.loading = false;
		       this.showToast('success', 'Success!', this.data.message);

		       this.sistConfigurado = true;

		     },
		     msg => { // Error
		       console.log(msg);
		       //console.log(msg.error.error);

		       this.loading = false;

		       //token invalido/ausente o token expiro
		       if(msg.status == 400 || msg.status == 401){ 
		            //alert(msg.error.error);
		            this.showToast('warning', 'Warning!', msg.error.error);
		        }
		        else { 
		            //alert(msg.error.error);
		            this.showToast('error', 'Erro!', msg.error.error);
		        }   

		     }
		   );
	}

	actualizarVarSist() {

		this.loading = true;

		var datos= {
	        token: localStorage.getItem('mouvers_token'),
	        costoxkm: this.costoxkm,
	      }
	    console.log(datos);

		this.http.put(this.rutaService.getRutaApi()+'sistema/'+this.idVarSistema, datos)
		   .toPromise()
		   .then(
		     data => { // Success
		       console.log(data);
		       this.data = data;

		       this.idVarSistema=this.data.varSistema.id;
		       this.costoxkm=this.data.varSistema.costoxkm;

		       this.loading = false;
		       this.showToast('success', 'Success!', this.data.message);

		     },
		     msg => { // Error
		       console.log(msg);
		       //console.log(msg.error.error);

		       this.loading = false;

		       //token invalido/ausente o token expiro
		       if(msg.status == 400 || msg.status == 401){ 
		            //alert(msg.error.error);
		            this.showToast('warning', 'Warning!', msg.error.error);
		        }
		        else { 
		            //alert(msg.error.error);
		            this.showToast('error', 'Erro!', msg.error.error);
		        }   

		     }
		   );
	}



}
