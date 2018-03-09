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
  selector: 'ngx-establecimientos-agregar',
  styleUrls: ['./establecimientos-agregar.component.scss'],
  templateUrl: './establecimientos-agregar.component.html',
})
export class EstablecimientosAgregarComponent implements OnInit{

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


  constructor( private toasterService: ToasterService,
           private http: HttpClient,
           private router: Router,
           private rutaService: RutaBaseService,
           public fb: FormBuilder)
  {

  	this.myFormAgregar = this.fb.group({
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        lat: ['5555', [Validators.required]],
        lng: ['5555', [Validators.required]]
      });
  }

  ngOnInit() {

    
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



    crear() {
      console.log(this.myFormAgregar.value);
      
      this.loading = true;

      var datos= {
        token: localStorage.getItem('mouvers_token'),
        nombre: this.myFormAgregar.value.nombre,
        direccion: this.myFormAgregar.value.direccion,
        lat: this.myFormAgregar.value.lat,
        lng: this.myFormAgregar.value.lng,
        estado: 'ON',
      }

      this.http.post(this.rutaService.getRutaApi()+'mouversAPI/public/establecimientos', datos)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

              //alert(this.data.message);
              this.loading = false;
              this.showToast('success', 'Success!', this.data.message);

              this.myFormAgregar.reset();
  
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
