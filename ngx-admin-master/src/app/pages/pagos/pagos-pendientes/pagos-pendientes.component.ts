import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

//import { FormBuilder, FormArray, FormGroup, Validators, FormControl  } from '@angular/forms';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngx-pagos-pendientes',
  templateUrl: './pagos-pendientes.component.html',
  /*styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],*/
  styleUrls: ['./pagos-pendientes.component.scss'],
})
export class PagosPendientesComponent implements OnInit{

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
  public productList:any;

  selectedObj: any;
  pedidos: any;
  total_deuda = 0;
  cancelar_monto = 0;

  public loading = false;
  public pagando = false;
  public mostrar = true;

  constructor( private modalService: NgbModal,
               private toasterService: ToasterService,
               private http: HttpClient,
               private router: Router,
               private rutaService: RutaBaseService)
  {
    

  }

  ngOnInit() {
    
    this.loading = true;
    this.http.get(this.rutaService.getRutaApi()+'establecimientos?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success

           console.log(data);
           this.data=data;
           this.productList = this.data.establecimientos;
           this.filteredItems = this.productList;
           //console.log(this.productList);

           this.init();

           this.loading = false;

         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);

           this.loading = false;

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);

                this.showToast('warning', 'Warning!', msg.error.error);
                this.mostrar = false;
                setTimeout(()=>{
                  this.router.navigateByUrl('/pagessimples/loginf');
                },1000);
            }
            //sin establecimientos
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

  //Abrir modal por defecto
  open(modal) {
    this.modalService.open(modal);
  }

  //Abrir modal larga
  open2(modal) {
    this.modalService.open(modal , { size: 'lg', backdrop: 'static', container: 'nb-layout', keyboard: false});
  }

  atras(): void {
    this.pagando = false;
    this.selectedObj = null;
    this.total_deuda = 0;
    this.cancelar_monto = 0;
  }

  getDeuda(obj) {

    this.selectedObj = Object.assign({},obj);
    console.log(this.selectedObj);
    
    this.loading = true;
    this.http.get(this.rutaService.getRutaApi()+'pagos/pendientes/'+this.selectedObj.id+'?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success

           console.log(data);
           this.data=data;
           this.pedidos = this.data.pedidos;
           this.total_deuda = this.data.total_deuda;

           this.loading = false;
           this.pagando = true;

         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);

           this.loading = false;

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);

                this.showToast('warning', 'Warning!', msg.error.error);
                this.mostrar = false;
            }
            //sin deuda
            else if(msg.status == 404){ 
                //alert(msg.error.error);
                this.showToast('info', 'Info!', msg.error.error);
            }
            

         }
       );
  }

  addPago(pedido): void {
      
      if (pedido.cancelar == 'SI') {
        pedido.cancelar = 'NO';
        this.cancelar_monto = this.cancelar_monto - pedido.total_pedido;
      }else{
        pedido.cancelar = 'SI';
        this.cancelar_monto = this.cancelar_monto + pedido.total_pedido;
      }

  }

  confirmarPago(modal): void {
      
      this.open(modal);

  }

  registrarPago(): void {
    
    this.loading = true;

    var pivotes = [];
    for (var i = 0; i < this.pedidos.length; i++) {
      if (this.pedidos[i].cancelar == 'SI') {
        for (var j = 0; j < this.pedidos[i].productos.length; j++) {
          pivotes.push(this.pedidos[i].productos[j].pivot);
        }
      }
    }

    var datos= {
      token: localStorage.getItem('mouvers_token'),
      establecimiento_id: this.selectedObj.id,
      monto: this.cancelar_monto,
      pivots: JSON.stringify(pivotes),
    }

    //console.log(datos);

    this.http.post(this.rutaService.getRutaApi()+'pagos', datos)
       .toPromise()
       .then(
         data => { // Success
            console.log(data);
            this.data = data;

            this.loading = false;
            this.atras();
            this.showToast('success', 'Success!', this.data.message); 
         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);

           this.loading = false;
           this.atras();

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);
                //ir a login
                this.showToast('warning', 'Warning!', msg.error.error);
            }
            else { 
                //alert(msg.error.error);
                this.showToast('error', 'Erro!', msg.error.error);
            }
         }
       );
  }


   //----Tabla<
   filteredItems : any;
   pages : number = 4;
   pageSize : number = 5;
   pageNumber : number = 0;
   currentIndex : number = 1;
   items: any;
   pagesIndex : Array<number>;
   pageStart : number = 1;
   inputName : string = '';

   init(){
         this.currentIndex = 1;
         this.pageStart = 1;
         this.pages = 4;

         this.pageNumber = parseInt(""+ (this.filteredItems.length / this.pageSize));
         if(this.filteredItems.length % this.pageSize != 0){
            this.pageNumber ++;
         }
    
         if(this.pageNumber  < this.pages){
               this.pages =  this.pageNumber;
         }
       
         this.refreshItems();
         console.log("this.pageNumber :  "+this.pageNumber);
   }

   FilterByName(){
      this.filteredItems = [];
      if(this.inputName != ""){
            for (var i = 0; i < this.productList.length; ++i) {
              if (this.productList[i].nombre.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].direccion.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }
            }
      }else{
         this.filteredItems = this.productList;
      }
      console.log(this.filteredItems);
      this.init();
   }
   fillArray(): any{
      var obj = new Array();
      for(var index = this.pageStart; index< this.pageStart + this.pages; index ++) {
                  obj.push(index);
      }
      return obj;
   }
   refreshItems(){
       this.items = this.filteredItems.slice((this.currentIndex - 1)*this.pageSize, (this.currentIndex) * this.pageSize);
       this.pagesIndex =  this.fillArray();
   }
   prevPage(){
      if(this.currentIndex>1){
         this.currentIndex --;
      } 
      if(this.currentIndex < this.pageStart){
         this.pageStart = this.currentIndex;
      }
      this.refreshItems();
   }
   nextPage(){
      if(this.currentIndex < this.pageNumber){
            this.currentIndex ++;
      }
      if(this.currentIndex >= (this.pageStart + this.pages)){
         this.pageStart = this.currentIndex - this.pages + 1;
      }
 
      this.refreshItems();
   }
    setPage(index : number){
         this.currentIndex = index;
         this.refreshItems();
    }
  //----Tabla>



}
