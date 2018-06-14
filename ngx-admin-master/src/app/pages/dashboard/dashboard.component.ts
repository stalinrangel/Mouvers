import { Component, OnInit, OnDestroy } from '@angular/core';

// Mis imports
import { NbSpinnerService, NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';

import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../services/ruta-base/ruta-base.service';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

	items = [{ title: 'Profile' }, { title: 'Log out' }];

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

	data : any;
	data1 : any;
	data2 : any;
	data3 : any;
	data4 : any;
	data5 : any;
	data6 : any;
	data7 : any;

	themeSubscription: any;

	dias = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	meses = [1,2,3,4,5,6,7,8,9,10,11,12];
	anios = [];

	diaActual: any;
	mesActual: any;
	anioActual: any;

	//Categorias mas vendidas
	categorias = [];
	loadDiagram1 = false;
	diagram1 = false;
	radioModelD1 = 'left';
	diaD1: any;
	mesD1: any;
	anioD1: any;

	//Subcategorias mas vendidas
	subcategorias = [];
	loadDiagram2 = false;
	diagram2 = false;
	radioModelD2 = 'left';
	diaD2: any;
	mesD2: any;
	anioD2: any;

	//Ventas por establecimiento
	establecimientos = [];
	loadDiagram3 = false;
	diagram3 = false;
	radioModelD3 = 'left';
	diaD3: any;
	mesD3: any;
	anioD3: any;

	//Ventas por hora
	pedidosA = [];
	loadDiagram4 = false;
	diagram4 = false;
	radioModelD4 = 'left';
	diaD4: any;
	mesD4: any;
	anioD4: any;

	//Ventas por hora (Cat comida)
	pedidosB = [];
	loadDiagram5 = false;
	diagram5 = false;
	radioModelD5 = 'left';
	diaD5: any;
	mesD5: any;
	anioD5: any;

	//kms por repartidor
	repartidores = [];
	loadTabla1 = false;
	tabla1 = false;
	radioModelT1 = 'left';
	diaT1: any;
	mesT1: any;
	anioT1: any;

	//calificaciones
	calificaciones = [];
	loadTabla2 = false;
	tabla2 = false;
	radioModelT2 = 'left';
	diaT2: any;
	mesT2: any;
	anioT2: any;

	//Contadores
	count_1: any;
	count_2: any;
	count_3: any;
	count_4: any;
	
	constructor(public themeService:NbThemeService,
				private toasterService: ToasterService,
				private http: HttpClient,
                private router: Router,
                private rutaService: RutaBaseService
				){

		this.count_1 = 'Consultando.....';
		this.count_2 = 'Consultando.....';
		this.count_3 = 'Consultando.....';
		this.count_4 = 'Consultando.....';

		var fecha = new Date();
		//var fecha = Date.now();
		this.diaActual = fecha.getDate();
		this.mesActual = fecha.getMonth() + 1;
		this.anioActual = fecha.getFullYear();

		this.anios.push(this.anioActual);
		for (var i = 1; i < 5; i++) {
			this.anios.push(this.anioActual - i);
		}

		this.diaD1 = this.diaActual;
		this.mesD1 = this.mesActual;
		this.anioD1 = this.anioActual;

		this.diaD2 = this.diaActual;
		this.mesD2 = this.mesActual;
		this.anioD2 = this.anioActual;

		this.diaD3 = this.diaActual;
		this.mesD3 = this.mesActual;
		this.anioD3 = this.anioActual;

		this.diaD4 = this.diaActual;
		this.mesD4 = this.mesActual;
		this.anioD4 = this.anioActual;

		this.diaD5 = this.diaActual;
		this.mesD5 = this.mesActual;
		this.anioD5 = this.anioActual;

		this.diaT1 = this.diaActual;
		this.mesT1 = this.mesActual;
		this.anioT1 = this.anioActual;

		this.diaT2 = this.diaActual;
		this.mesT2 = this.mesActual;
		this.anioT2 = this.anioActual;

		//console.log(this.diaActual+'-'+this.mesActual+'-'+this.anioActual);

	}

	ngOnInit() {
		//this.themeService.changeTheme('cosmic');
		this.themeService.changeTheme('default');

		this.getContadores();
		this.getDiagram1();
		this.getDiagram2();
		this.getDiagram3();
		this.getDiagram4();
		this.getDiagram5();
		this.getTabla1();
		this.getTabla2();
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

	//Obtener los contadores del dia
	getContadores() {

	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/contadores?token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data=data;
	           this.count_1 = this.data.pedidos_curso;
	           this.count_2 = this.data.pedidos_finalizados;
	           this.count_3 = this.data.repartidores_activos;
	           if (!this.data.dinero_recaudado) {
	           	this.count_4 = 0;
	           }else{
	           	this.count_4 = this.data.dinero_recaudado;
	           }
	           

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }else{
	            	this.showToast('info', 'Info!', 'Algo salió mal.');
	            }

	         }
	    );
	}

	//Obtener las cateogrias mas vendidas
	getDiagram1() {

		if (this.radioModelD1 == 'left') {
			var dia = this.diaD1;
			var mes = this.mesD1;
			var anio = this.anioD1;
		}else{
			var dia = null;
			var mes = this.mesD1;
			var anio = this.anioD1;
		}

		this.diagram1 = false;
		this.loadDiagram1 = true;
		this.categorias = [];
	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/diagram1?dia='+dia+'&mes='+mes+'&anio='+anio+'&token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data1=data;
	           this.categorias = this.data1.categorias;

	           this.loadDiagram1 = false;

	           if (this.categorias.length > 0) {
	           	this.diagram1 = true;
	           }else{
	           	this.diagram1 = false;
	           }

	           

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           this.loadDiagram1 = false;

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }
	            //sin data
	            else if(msg.status == 404){ 
	                //alert(msg.error.error);
	                this.showToast('info', 'Info!', msg.error.error);
	            }
	            

	         }
	    );
	}

	//Obtener las subcateogrias mas vendidas
	getDiagram2() {

		if (this.radioModelD2 == 'left') {
			var dia = this.diaD2;
			var mes = this.mesD2;
			var anio = this.anioD2;
		}else{
			var dia = null;
			var mes = this.mesD2;
			var anio = this.anioD2;
		}

		this.diagram2 = false;
		this.loadDiagram2 = true;
		this.subcategorias = [];
	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/diagram2?dia='+dia+'&mes='+mes+'&anio='+anio+'&token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data2=data;
	           this.subcategorias = this.data2.subcategorias;

	           this.loadDiagram2 = false;

	           if (this.subcategorias.length > 0) {
	           	this.diagram2 = true;
	           }else{
	           	this.diagram2 = false;
	           }

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           this.loadDiagram2 = false;

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }
	            //sin data
	            else if(msg.status == 404){ 
	                //alert(msg.error.error);
	                this.showToast('info', 'Info!', msg.error.error);
	            }
	            

	         }
	    );
	}

	//Obtener las ventas por establecimiento
	getDiagram3() {

		if (this.radioModelD3 == 'left') {
			var dia = this.diaD3;
			var mes = this.mesD3;
			var anio = this.anioD3;
		}else{
			var dia = null;
			var mes = this.mesD3;
			var anio = this.anioD3;
		}

		this.diagram3 = false;
		this.loadDiagram3 = true;
		this.establecimientos = [];
	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/diagram3?dia='+dia+'&mes='+mes+'&anio='+anio+'&token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data3=data;
	           this.establecimientos = this.data3.establecimientos;

	           this.loadDiagram3 = false;
	           
	           if (this.establecimientos.length > 0) {
	           	this.diagram3 = true;
	           }else{
	           	this.diagram3 = false;
	           }

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           this.loadDiagram3 = false;

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }
	            //sin data
	            else if(msg.status == 404){ 
	                //alert(msg.error.error);
	                this.showToast('info', 'Info!', msg.error.error);
	            }
	            

	         }
	    );
	}

	//Obtener las ventas por hora
	getDiagram4() {

		if (this.radioModelD4 == 'left') {
			var dia = this.diaD4;
			var mes = this.mesD4;
			var anio = this.anioD4;
		}else{
			var dia = null;
			var mes = this.mesD4;
			var anio = this.anioD4;
		}

		this.diagram4 = false;
		this.loadDiagram4 = true;
		this.pedidosA = [];
	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/diagram4?dia='+dia+'&mes='+mes+'&anio='+anio+'&token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data3=data;
	           this.pedidosA = this.data3.pedidos;

	           this.loadDiagram4 = false;
	           
	           if (this.pedidosA.length > 0) {
	           	this.diagram4 = true;
	           }else{
	           	this.diagram4 = false;
	           }

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           this.loadDiagram4 = false;

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }
	            //sin data
	            else if(msg.status == 404){ 
	                //alert(msg.error.error);
	                this.showToast('info', 'Info!', msg.error.error);
	            }
	            

	         }
	    );
	}

	//Obtener las ventas por hora de la Categoria comida
	getDiagram5() {

		if (this.radioModelD5 == 'left') {
			var dia = this.diaD5;
			var mes = this.mesD5;
			var anio = this.anioD5;
		}else{
			var dia = null;
			var mes = this.mesD5;
			var anio = this.anioD5;
		}

		this.diagram5 = false;
		this.loadDiagram5 = true;
		this.pedidosB = [];
	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/diagram5?dia='+dia+'&mes='+mes+'&anio='+anio+'&token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data5=data;
	           this.pedidosB = this.data5.pedidos;

	           this.loadDiagram5 = false;
	           
	           if (this.pedidosB.length > 0) {
	           	this.diagram5 = true;
	           }else{
	           	this.diagram5 = false;
	           }

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           this.loadDiagram5 = false;

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }
	            //sin data
	            else if(msg.status == 404){ 
	                //alert(msg.error.error);
	                this.showToast('info', 'Info!', msg.error.error);
	            }
	            

	         }
	    );
	}

	//Obtener los km recorridos por repartidor
	getTabla1() {

		if (this.radioModelT1 == 'left') {
			var dia = this.diaT1;
			var mes = this.mesT1;
			var anio = this.anioT1;
		}else{
			var dia = null;
			var mes = this.mesT1;
			var anio = this.anioT1;
		}

		this.tabla1 = false;
		this.loadTabla1 = true;
		this.repartidores = [];
	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/tabla1?dia='+dia+'&mes='+mes+'&anio='+anio+'&token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data6=data;
	           this.repartidores = this.data6.repartidores;

	           this.loadTabla1 = false;
	           
	           if (this.repartidores.length > 0) {
	           	this.tabla1 = true;
	           }else{
	           	this.tabla1 = false;
	           }

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           this.loadTabla1 = false;

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }
	            //sin data
	            else if(msg.status == 404){ 
	                //alert(msg.error.error);
	                this.showToast('info', 'Info!', msg.error.error);
	            }
	            

	         }
	    );
	}

	//Obtener las calificaiones
	getTabla2() {

		if (this.radioModelT2 == 'left') {
			var dia = this.diaT2;
			var mes = this.mesT2;
			var anio = this.anioT2;
		}else{
			var dia = null;
			var mes = this.mesT2;
			var anio = this.anioT2;
		}

		this.tabla2 = false;
		this.loadTabla2 = true;
		this.calificaciones = [];
	    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/dashboard/tabla2?dia='+dia+'&mes='+mes+'&anio='+anio+'&token='+localStorage.getItem('mouvers_token'))
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data7=data;
	           this.calificaciones = this.data7.calificaciones;

	           this.loadTabla2 = false;
	           
	           if (this.calificaciones.length > 0) {
	           	this.tabla2 = true;
	           }else{
	           	this.tabla2 = false;
	           }

	         },
	         msg => { // Error
	           console.log(msg);
	           console.log(msg.error.error);

	           this.loadTabla2 = false;

	           //token invalido/ausente o token expiro
	           if(msg.status == 400 || msg.status == 401){ 
	                //alert(msg.error.error);

	                this.showToast('warning', 'Warning!', msg.error.error);
	                   
	            }
	            //sin data
	            else if(msg.status == 404){ 
	                //alert(msg.error.error);
	                this.showToast('info', 'Info!', msg.error.error);
	            }
	            

	         }
	    );
	}

	/*
	loadDiagram1 = false;
	categorias = [];
	optionsD1: any;
	dataD1: any;
	labelsD1 = [];
	datosD1 = [];
	setDiagram1() {

		for (var i = 0; i < this.categorias.length; ++i) {
			this.labelsD1.push(this.categorias[i].nombre);
			this.datosD1.push(this.categorias[i].count_solicitados);
		}

	    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {

	      const colors: any = config.variables;
	      const chartjs: any = config.variables.chartjs;

	      this.dataD1 = {
	        labels: this.labelsD1,
	        datasets: [{
	          data: this.datosD1,
	          backgroundColor: [colors.primaryLight, colors.infoLight, colors.successLight],
	        }],
	      };

	      this.optionsD1 = {
	        maintainAspectRatio: false,
	        responsive: true,
	        scales: {
	          xAxes: [
	            {
	              display: false,
	            },
	          ],
	          yAxes: [
	            {
	              display: false,
	            },
	          ],
	        },
	        legend: {
	          labels: {
	            fontColor: chartjs.textColor,
	          },
	        },
	      };
	    });
	}

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }*/

}
