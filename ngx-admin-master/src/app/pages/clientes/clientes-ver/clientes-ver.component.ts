import { Component, OnInit } from '@angular/core';
//import { LocalDataSource } from 'ng2-smart-table';
//import { SmartTableService } from '../../../@core/data/smart-table.service';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-ver-cli',
  templateUrl: './clientes-ver.component.html',
  /*styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],*/
  styleUrls: ['./clientes-ver.component.scss'],
})
export class ClientesVerComponent implements OnInit{

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

  public data:any;
  private productList:any;

  public loading = false;
  public mostrar = true;

  objAEditar: any;
  objAEliminar: any;
  eliminar_id: any;
  eliminar_nombre: any;

  constructor(private modalService: NgbModal,
              private toasterService: ToasterService,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private rutaService: RutaBaseService)
  {

  }

  ngOnInit() {
    
    this.loading = true;
    this.http.get(this.rutaService.getRutaApi()+'usuarios?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data=data;

           this.productList = this.data.usuarios;
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

  //Redirigir al chat
  chat(cliente) {
    console.log(cliente);
    if (cliente.chat_cliente) {
      localStorage.setItem('mouvers_chat_id', cliente.chat_cliente.id);
    }else{
      localStorage.setItem('mouvers_chat_id', '');
    }
    localStorage.setItem('mouvers_usuario_id', cliente.id);
    localStorage.setItem('mouvers_usuario_tipo', cliente.tipo_usuario);
    localStorage.setItem('mouvers_usuario_nombre', cliente.nombre);
    localStorage.setItem('mouvers_usuario_imagen', cliente.imagen);
    localStorage.setItem('mouvers_usuario_token_notifi', cliente.token_notificacion);

    this.router.navigateByUrl('/pages/chat-box');
  }

  //Abrir modal por defecto
  open(modal) {
    this.modalService.open(modal);
  }

  //Abrir modal larga
  open2(modal) {
    this.modalService.open(modal , { size: 'lg', backdrop: 'static', container: 'nb-layout', keyboard: false});
  }

    aEliminar(obj): void {
      this.objAEliminar = obj;
      //console.log(this.objAEliminar);
      this.eliminar_id = this.objAEliminar.id;
      this.eliminar_nombre = this.objAEliminar.nombre;
    }

    eliminar(): void {
      console.log(this.objAEliminar);
      
      this.loading = true;

      var datos= {
        token: localStorage.getItem('mouvers_token')
      }

      this.http.delete(this.rutaService.getRutaApi()+'usuarios/'+this.eliminar_id+'?token='+localStorage.getItem('mouvers_token'))
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

              var aux = this.productList;
              this.productList = [];

              for (var i = 0; i < aux.length; ++i) {
                if (aux[i].id != this.eliminar_id) {
                   this.productList.push(aux[i]);
                }
              }

              this.filteredItems = this.productList;
              this.init();
              
              //console.log(this.productList);
              //alert(this.data.message);
              this.loading = false;
              this.showToast('success', 'Success!', this.data.message);    
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
              }
              //no encontrada o confilto
              else if(msg.status == 404 || msg.status == 409){ 
                  //alert(msg.error.error);
                  this.showToast('error', 'Erro!', msg.error.error);
              }

           }
         );
    }

    //Para el cliente
    cambiarStatus(obj): void {

      var v_status: any;

      if (obj.status == 'ON') {
        //obj.status = 'OFF';
        v_status = 'OFF';
      }else{
        //obj.status = 'ON';
        v_status = 'ON';
      }

      var datos= {
        token: localStorage.getItem('mouvers_token'),
        status: v_status
      }

      this.http.put(this.rutaService.getRutaApi()+'usuarios/'+obj.id, datos)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;
              this.showToast('success', 'Success!', this.data.message);
              obj.status = v_status;
              
           },
           msg => { // Error
             console.log(msg);
             console.log(msg.error.error);

              //Regresar el switch en caso de error
              if (v_status == 'ON') {
                //obj.status = 'OFF';
                obj.status = 'OFF';
              }else{
                //obj.status = 'ON';
                obj.status = 'ON';
              }

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
              }else if (this.productList[i].email.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].ciudad.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].estado.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].telefono.indexOf(this.inputName)>=0) {
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
