import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

// Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

import { FormBuilder, FormArray, FormGroup, Validators  } from '@angular/forms';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-socios-agregar',
  styleUrls: ['./socios-agregar.component.scss'],
  templateUrl: './socios-agregar.component.html',
})
export class SociosAgregarComponent implements OnInit{

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
	public mostrar = true;

	//Formularios
	myFormAgregar: FormGroup;

  	public estados:any;
  	public ciudades:any;

  constructor( private toasterService: ToasterService,
           private http: HttpClient,
           private router: Router,
           private rutaService: RutaBaseService,
           public fb: FormBuilder)
  {

  	this.myFormAgregar = this.fb.group({
          nombre: ['', [Validators.required]],
	      email: ['', [Validators.required]],
	      password: ['', [Validators.required]],
	      password2: ['', [Validators.required]],
	      telefono: ['', [Validators.required]],
	      ciudad: ['', [Validators.required]],
	      estado: ['', [Validators.required]]
      });
  }

  ngOnInit() {
	this.getEstados();  
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

  getEstados(): void {

  	this.loading = true;

    this.http.get(this.rutaService.getRutaApi()+'entidades/municipios?token='+localStorage.getItem('mouvers_token'))
  
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data = data;
           this.estados=this.data.entidades;
           this.loading = false; 
         },
         msg => { // Error
           //console.log(msg);
           console.log(msg.error.error);
           this.loading = false;

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);
                //ir a login
                this.showToast('warning', 'Warning!', msg.error.error);
                setTimeout(()=>{
                  this.router.navigateByUrl('/pagessimples/loginf');
                },1000);
            }
            else if(msg.status == 404){ 
                //alert(msg.error.error);
                this.showToast('info', 'Info!', msg.error.error);
            }

         }
       );
   }

	setEstado2(estado): void {
		console.log(estado);
		for (var i = 0; i < this.estados.length; ++i) {
		  if (estado == this.estados[i].nom_ent) {
		    this.ciudades = this.estados[i].municipios;

		    this.myFormAgregar.patchValue({ciudad : this.ciudades[0].nom_mun});
		  }
		}
	} 

    crear() {
      console.log(this.myFormAgregar.value);

      if (this.myFormAgregar.value.password != this.myFormAgregar.value.password2) {

      	this.showToast('warning', 'Warning!', 'Las contraseñas no coinciden.');

      }else{

      	  this.loading = true;

	      var datos= {
	        token: localStorage.getItem('mouvers_token'),
	        nombre: this.myFormAgregar.value.nombre,
	        email: this.myFormAgregar.value.email,
	        password: this.myFormAgregar.value.password,
	        telefono: this.myFormAgregar.value.telefono,
	        ciudad: this.myFormAgregar.value.ciudad,
	        estado: this.myFormAgregar.value.estado
	        
	      }

	      this.http.post(this.rutaService.getRutaApi()+'repartidores', datos)
	         .toPromise()
	         .then(
	           data => { // Success
	              console.log(data);
	              this.data = data;

	              //alert(this.data.message);
	              this.loading = false;
	              this.showToast('success', 'Success!', this.data.message);

	              this.myFormAgregar.reset();
	              //this.clearFile();
	  
	           },
	           msg => { // Error
	             console.log(msg);
	             console.log(msg.error.error);

	             this.loading = false;

	             //token invalido/ausente o token expiro
	             if(msg.status == 400 || msg.status == 401){ 
	                  //alert(msg.error.error);
	                  //ir a login

	                  this.showToast('warning', 'Warning!', msg.error.error);
	                  //this.mostrar = false;
	              }
	              else { 
	                  //alert(msg.error.error);
	                  this.showToast('error', 'Erro!', msg.error.error);
	              }
	           }
	         );

      }
      

    }

}
