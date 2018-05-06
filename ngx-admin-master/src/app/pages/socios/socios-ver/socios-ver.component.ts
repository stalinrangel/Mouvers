import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

//Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

import { FormBuilder, FormArray, FormGroup, Validators  } from '@angular/forms';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-ver-socios',
  templateUrl: './socios-ver.component.html',
  /*styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],*/
  styleUrls: ['./socios-ver.component.scss'],
})
export class SociosVerComponent implements OnInit{

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

  objAEditar: any;
  objAEliminar: any;
  eliminar_id: any;
  eliminar_nombre: any;

  public loading = false;
  public editando = false;
  public agregando = false;
  public mostrar = true;

  //Formularios
  myFormEditar: FormGroup;

  public productList2:any;

  public habCategoria:any;

  public catSelecAux:any;

  public admin = false;

  closeResult: string;

  public estados:any;
  public ciudades:any;

  constructor( private modalService: NgbModal,
               private toasterService: ToasterService,
               private http: HttpClient,
               private router: Router,
               private route: ActivatedRoute,
               private rutaService: RutaBaseService,
               public fb: FormBuilder)
  {
    
    this.myFormEditar = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    
    this.loading = true;
    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/repartidores?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success

           this.getEstados();

           console.log(data);
           this.data=data;
           this.productList = this.data.repartidores;
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
            }
            //sin usuarios
            else if(msg.status == 404){ 
                //alert(msg.error.error);
                this.showToast('info', 'Info!', msg.error.error);
            }
            

         }
       );
  }

  //Redirigir al chat
  chat(repartidor) {
    console.log(repartidor);
    localStorage.setItem('mouvers_chat_id', repartidor.usuario.id);
    localStorage.setItem('mouvers_chat_nombre', repartidor.usuario.nombre);
    localStorage.setItem('mouvers_chat_tipo_usuario', repartidor.usuario.tipo_usuario);

    this.router.navigateByUrl('/pages/chat-box');
  }

  getEstados(): void {
    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/entidades/municipios?token='+localStorage.getItem('mouvers_token'))
  
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data = data;
           this.estados=this.data.entidades; 
         },
         msg => { // Error
           //console.log(msg);
           console.log(msg.error.error);

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);
                //ir a login
                this.showToast('warning', 'Warning!', msg.error.error);
            }
            //sin categorias o todas deshabilitadas OFF
            else if(msg.status == 404){ 
                //alert(msg.error.error);
                this.showToast('info', 'Info!', msg.error.error);
            }

         }
       );
  }

  setEstado1(estado): void {
    console.log(estado);
    for (var i = 0; i < this.estados.length; ++i) {
      if (estado == this.estados[i].nom_ent) {
        this.ciudades = this.estados[i].municipios;
      }
    }
  }  

  setEstado2(estado): void {
    console.log(estado);
    for (var i = 0; i < this.estados.length; ++i) {
      if (estado == this.estados[i].nom_ent) {
        this.ciudades = this.estados[i].municipios;

        this.myFormEditar.patchValue({ciudad : this.ciudades[0].nom_mun});
      }
    }
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
      this.editando = false;
      this.objAEditar = null;
      //console.log(this.objAEditar);

      //this.uploadFile = null;
      this.myFormEditar.reset();
    }

    aEditar(obj): void {
      this.editando = true;
      this.objAEditar = Object.assign({},obj);
      console.log(this.objAEditar);

      this.myFormEditar.patchValue({id : this.objAEditar.id});
      this.myFormEditar.patchValue({nombre : this.objAEditar.usuario.nombre});
      this.myFormEditar.patchValue({email : this.objAEditar.usuario.email});
      this.myFormEditar.patchValue({telefono : this.objAEditar.usuario.telefono});
      this.myFormEditar.patchValue({estado : this.objAEditar.usuario.estado});
      this.myFormEditar.patchValue({ciudad : this.objAEditar.usuario.ciudad});

      this.setEstado1(this.objAEditar.usuario.estado);
     
    }

    editar(): void {
     
      this.loading = true;

      var datos= {
        token: localStorage.getItem('mouvers_token'),
        nombre: this.myFormEditar.value.nombre,
        email: this.myFormEditar.value.email,
        telefono: this.myFormEditar.value.telefono,
        ciudad: this.myFormEditar.value.ciudad,
        estado: this.myFormEditar.value.estado,
      }

      this.http.put(this.rutaService.getRutaApi()+'mouversAPI/public/repartidores/'+this.myFormEditar.value.id, datos)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

              for (var i = 0; i < this.productList.length; ++i) {
                if (this.productList[i].id == this.myFormEditar.value.id) {
                   this.productList[i].usuario.nombre = this.myFormEditar.value.nombre;
                   this.productList[i].usuario.email = this.myFormEditar.value.email;
                   this.productList[i].usuario.telefono = this.myFormEditar.value.telefono;
                   this.productList[i].usuario.ciudad = this.myFormEditar.value.ciudad;
                   this.productList[i].usuario.estado = this.myFormEditar.value.estado;
                }
              }

              this.filteredItems = this.productList;
              this.init();
              
              //console.log(this.productList);
              //alert(this.data.message);

              this.loading = false;
              this.editando = false;
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
                  this.editando = false;
                  this.showToast('warning', 'Warning!', msg.error.error);
              }
              else { 
                  //alert(msg.error.error);
                  this.editando = true;
                  this.showToast('error', 'Erro!', msg.error.error);
              }
           }
         );
    }

    aEliminar(obj): void {
      this.objAEliminar = obj;
      //console.log(this.objAEliminar);
      this.eliminar_id = this.objAEliminar.id;
      this.eliminar_nombre = this.objAEliminar.usuario.nombre;
    }

    eliminar(): void {
      console.log(this.objAEliminar);
      
      this.loading = true;

      var datos= {
        token: localStorage.getItem('mouvers_token')
      }

      this.http.delete(this.rutaService.getRutaApi()+'mouversAPI/public/repartidores/'+this.eliminar_id+'?token='+localStorage.getItem('mouvers_token'))
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

    //Para el repartidor
    cambiarEstado(obj): void {

      var v_estado: any;

      if (obj.estado == 'ON') {
        //obj.estado = 'OFF';
        v_estado = 'OFF';
      }else{
        //obj.estado = 'ON';
        v_estado = 'ON';
      }

      var datos= {
        token: localStorage.getItem('mouvers_token'),
        rep_estado: v_estado
      }

      this.http.put(this.rutaService.getRutaApi()+'mouversAPI/public/repartidores/'+obj.id, datos)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;
              this.showToast('success', 'Success!', this.data.message);
              obj.estado = v_estado;
              
           },
           msg => { // Error
             console.log(msg);
             console.log(msg.error.error);

              //Regresar el switch en caso de error
              if (v_estado == 'ON') {
                //obj.estado = 'OFF';
                obj.estado = 'OFF';
              }else{
                //obj.estado = 'ON';
                obj.estado = 'ON';
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
              if (this.productList[i].usuario.nombre.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].usuario.email.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].usuario.telefono.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].usuario.estado.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].usuario.ciudad.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
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
