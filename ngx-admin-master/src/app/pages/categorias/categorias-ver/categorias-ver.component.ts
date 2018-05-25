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
  selector: 'ngx-ver-cat',
  templateUrl: './categorias-ver.component.html',
  /*styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],*/
  styleUrls: ['./categorias-ver.component.scss'],
})
export class CategoriasVerComponent implements OnInit{

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

  public mostrarSwiches = true;

  public admin = false;

  closeResult: string;

  @ViewChild('fileInput') fileInput: ElementRef;
  clear = false; //puedo borrar?
  fileIMG = null;
  imgUpload = null;
  loadinImg = false;

  constructor( private modalService: NgbModal,
               private toasterService: ToasterService,
               private http: HttpClient,
               private router: Router,
               private rutaService: RutaBaseService,
               public fb: FormBuilder)
  {
    
    this.myFormEditar = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      imagen: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    
    this.loading = true;
    this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/categorias?token='+localStorage.getItem('mouvers_token'))
       .toPromise()
       .then(
         data => { // Success
           console.log(data);
           this.data=data;
           this.productList = this.data.categorias;
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
            //sin categorias
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
      this.editando = false;
      this.objAEditar = null;
      //console.log(this.objAEditar);

      //this.uploadFile = null;
      this.myFormEditar.reset();
      this.clearFile();

    }

    aEditar(obj): void {
      this.editando = true;
      this.objAEditar = Object.assign({},obj);
      console.log(this.objAEditar);

      this.myFormEditar.patchValue({id : this.objAEditar.id});
      this.myFormEditar.patchValue({nombre : this.objAEditar.nombre});
      this.myFormEditar.patchValue({imagen : this.objAEditar.imagen});
    }

    editar(): void {
     
      this.loading = true;

      var imgAux: any;
      
      if(this.imgUpload){
        imgAux = this.imgUpload; 
      }
      else{
        imgAux = this.myFormEditar.value.imagen;
      }

      var datos= {
        token: localStorage.getItem('mouvers_token'),
        nombre: this.myFormEditar.value.nombre,
        imagen: imgAux
      }

      this.http.put(this.rutaService.getRutaApi()+'mouversAPI/public/categorias/'+this.myFormEditar.value.id, datos)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

              for (var i = 0; i < this.productList.length; ++i) {
                if (this.productList[i].id == this.myFormEditar.value.id) {
                   this.productList[i].nombre = this.myFormEditar.value.nombre;
                   this.productList[i].imagen = imgAux;
                }
              }

              this.filteredItems = this.productList;
              this.init();
              
              //console.log(this.productList);
              //alert(this.data.message);

              this.loading = false;
              this.editando = false;
              this.clearFile();
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
                  this.editando = true;
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

    //Carga de img---<
    subirImagen(): void {
     
      this.loading = true;

      const formModel = this.prepareSave();

      this.http.post(this.rutaService.getRutaApi()+'mouversAPI/public/imagenes?token='+localStorage.getItem('mouvers_token'), formModel)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;
              this.imgUpload = this.data.imagen;

              //Solo admitimos imágenes.
               if (!this.fileIMG.type.match('image.*')) {
                    return;
               }

               var reader = new FileReader();

               reader.onload = (function(theFile) {
                   return function(e) {
                   // Creamos la imagen.
                    document.getElementById("list").innerHTML = ['<img class="thumb" src="', e.target.result, '" height="160px"/>'].join('');
                   };
               })(this.fileIMG);
     
               reader.readAsDataURL(this.fileIMG);

               this.clear = true;

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
              else { 
                  //alert(msg.error.error);
                  this.showToast('error', 'Erro!', msg.error.error);
              }
           }
         );
    }

    private prepareSave(): any {
      let input = new FormData();
      input.append('imagen', this.fileIMG);
      input.append('carpeta', 'categorias');
      input.append('url_imagen', this.rutaService.getRutaImages());
      return input;
    }

    onFileChange(event) {
      if(event.target.files.length > 0) {
        this.fileIMG = event.target.files[0];

        this.subirImagen();
      }
    }

    clearFile() {
      this.imgUpload = null;
      this.fileInput.nativeElement.value = '';

      this.clear = false;
    }
    //Carga de img--->

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

      this.http.delete(this.rutaService.getRutaApi()+'mouversAPI/public/categorias/'+this.eliminar_id+'?token='+localStorage.getItem('mouvers_token'))
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

    cambioSwicheCat(obj, modal2): void{
      //console.log(obj.estado);

      this.catSelecAux = obj;

      if (obj.estado == 'ON') {
        //Apagando categoria
        this.cambiarEstado(obj);
      }else{
        //Encendiendo categoria
        this.cargarSubcategorias(obj, modal2);
      }
    }

    //Para la categoria
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
        estado: v_estado
      }

      this.http.put(this.rutaService.getRutaApi()+'mouversAPI/public/categorias/'+obj.id, datos)
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

    cargarSubcategorias(obj, modal2): void {

      this.loading = true;

      this.http.get(this.rutaService.getRutaApi()+'mouversAPI/public/categorias/'+obj.id+'/subcategorias?token='+localStorage.getItem('mouvers_token'))
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data=data;
              this.productList2 = this.data.categoria.subcategorias;
              this.filteredItems2 = this.productList2;
              //console.log(this.productList2);

              this.init2();
              
              this.loading = false;

              if (this.productList2.length == 0) {
                //alert('La categoria no tiene subcategorias');
                //Se cambia solo el estado de la categoria
                this.cambiarEstado(obj);
              }else{
                //alert('La categoria tiene '+this.productList2.length+' subcategorias');
                //Se muestra la modal para elgir las subcategorias q se quieren habilitar junto con la categoria
                this.habCategoria = obj;
                this.open2(modal2);
                this.mostrarSwiches = false;
              }
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
              else { 
                  //alert(msg.error.error);
                  this.showToast('error', 'Erro!', msg.error.error);
              }
           }
         );
    }

    apagarSwiche(): void{
      this.mostrarSwiches = true;
    }

    cambioSwicheSubCat(objSubcat): void {

      if (objSubcat.estado == 'ON') {
        objSubcat.estado = 'OFF';
      }else{
        objSubcat.estado = 'ON';
      }

    }

    habilitarCat(): void{
      //console.log(this.productList2);

      //this.cambiarEstado(this.habCategoria);

      //alert(JSON.stringify(this.productList2));

      /*var auxProductos = [];

      for (var i = 0; i < this.productList2.length; ++i) {
        auxProductos.push(this.productList2[i]);
      }

      alert(JSON.stringify(auxProductos));*/

      this.mostrarSwiches = true;

      this.loading = true;

      setTimeout(()=>{

        var datos= {
          token: localStorage.getItem('mouvers_token'),
          estado: 'ON',
          subcategorias: JSON.stringify(this.productList2)
          //productos: JSON.stringify(auxProductos)
          //productos: this.productos
          //productos: JSON.stringify(this.productos)
          //productos: '[{"id":1,"cantidad":3,"estado":"ON"},{"id":3,"cantidad":3,"estado":"OFF"}]'
        }

        this.http.put(this.rutaService.getRutaApi()+'mouversAPI/public/categorias/'+this.habCategoria.id, datos)
           .toPromise()
           .then(
             data => { // Success
                console.log(data);
                this.data = data;

                this.habCategoria.estado = 'ON';

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
                else { 
                    //alert(msg.error.error);
                    this.showToast('error', 'Erro!', msg.error.error);
                }
             }
           );

        },300);
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

   //Tabla2 Subcategorias de la categoria X----<
   filteredItems2 : any;
   pages2 : number = 4;
   pageSize2 : number = 5;
   pageNumber2 : number = 0;
   currentIndex2 : number = 1;
   items2: any;
   pagesIndex2 : Array<number>;
   pageStart2 : number = 1;
   inputName2 : string = '';

   init2(){
         this.currentIndex2 = 1;
         this.pageStart2 = 1;
         this.pages2 = 4;

         this.pageNumber2 = parseInt(""+ (this.filteredItems2.length / this.pageSize2));
         if(this.filteredItems2.length % this.pageSize2 != 0){
            this.pageNumber2 ++;
         }
    
         if(this.pageNumber2  < this.pages2){
               this.pages2 =  this.pageNumber2;
         }
       
         this.refreshItems2();
         console.log("this.pageNumber2 :  "+this.pageNumber2);
   }

   FilterByName2(){
      this.filteredItems2 = [];
      if(this.inputName2 != ""){
            for (var i = 0; i < this.productList2.length; ++i) {
              if (this.productList2[i].nombre.toUpperCase().indexOf(this.inputName2.toUpperCase())>=0) {
                 this.filteredItems2.push(this.productList2[i]);
              }
            }
      }else{
         this.filteredItems2 = this.productList2;
      }
      console.log(this.filteredItems2);
      this.init2();
   }
   fillArray2(): any{
      var obj = new Array();
      for(var index = this.pageStart2; index< this.pageStart2 + this.pages2; index ++) {
                  obj.push(index);
      }
      return obj;
   }
   refreshItems2(){
       this.items2 = this.filteredItems2.slice((this.currentIndex2 - 1)*this.pageSize2, (this.currentIndex2) * this.pageSize2);
       this.pagesIndex2 =  this.fillArray2();
   }
   prevPage2(){
      if(this.currentIndex2>1){
         this.currentIndex2 --;
      } 
      if(this.currentIndex2 < this.pageStart2){
         this.pageStart2 = this.currentIndex2;
      }
      this.refreshItems2();
   }
   nextPage2(){
      if(this.currentIndex2 < this.pageNumber2){
            this.currentIndex2 ++;
      }
      if(this.currentIndex2 >= (this.pageStart2 + this.pages2)){
         this.pageStart2 = this.currentIndex2 - this.pages2 + 1;
      }
 
      this.refreshItems2();
   }
    setPage2(index : number){
         this.currentIndex2 = index;
         this.refreshItems2();
    }
    //Tabla2 Subcategorias de la categoria X---->

}
