import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../rute-base/rute-base';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CartProvider {
  cartObj: any = {};
  codigos: any = [];
  products: any;
  costokm: any;
  ruta: any = [];
  varSistema: any;

  constructor(public storage: StorageProvider, public http: HttpClient, public rutebaseApi: RuteBaseProvider) {
    let code = this.storage.getObject('codeMouver');
    let item = this.storage.getObject('cartMouver');
    let user_id = this.storage.getObject('userMouver');
    let route = this.storage.getObject('routeMouver');

    if (item) {
      this.cartObj.cart = item.cart;
      this.cartObj.subtotal = item.subtotal;
      this.cartObj.cantidad = item.cantidad;
      this.cartObj.id = user_id.id;
      this.cartObj.address = item.address;
      this.cartObj.direccion = item.direccion;
      this.cartObj.distance = item.distance;
      this.cartObj.time = item.time;
      this.cartObj.delivery = item.delivery;
      this.cartObj.total = item.total;
    } else {
      this.codigos = [];
      this.cartObj.cart = [];
      this.cartObj.address = [];
      this.cartObj.subtotal = 0;
      this.cartObj.cantidad = 0;
      this.cartObj.id = user_id.id;
      this.cartObj.direccion = {direccion: '', lat: 0, lng: 0};
      this.cartObj.distance = 0;
      this.cartObj.time = 0;
      this.cartObj.delivery = 0;
      this.cartObj.total = 0;
    }
    if (code) {
      this.codigos = code;
      this.http.get(this.rutebaseApi.getRutaApi()+'productos/buscar/codigos?codigos='+JSON.stringify(this.codigos)+'&token='+this.storage.get('tokenMouver'))
      .toPromise()
      .then(
      data => { 
        this.products = data;
        this.consultProducts(this.products);
        if (this.costokm == undefined) {
          this.http.get(this.rutebaseApi.getRutaApi()+'sistema'+'?token='+this.storage.get('tokenMouver'))
          .toPromise()
          .then(
          data => { 
            this.varSistema = data;
            this.costokm = this.varSistema.varSistema.costoxkm;   
          },
          msg => {
          });
        }   
      },
      msg => {
        this.codigos = [];
        this.cartObj.cart = [];
        this.cartObj.address = [];
        this.cartObj.subtotal = 0;
        this.cartObj.cantidad = 0;
        this.cartObj.id = user_id.id;
        this.cartObj.direccion = {direccion: '', lat: 0, lng: 0};
        this.cartObj.distance = 0;
        this.cartObj.time = 0;
        this.cartObj.delivery = 0;
        this.cartObj.total = 0;
        this.cartObj.ruta = [];
        if (this.costokm == undefined) {
          this.http.get(this.rutebaseApi.getRutaApi()+'sistema'+'?token='+this.storage.get('tokenMouver'))
          .toPromise()
          .then(
          data => { 
            this.varSistema = data;
            this.costokm = this.varSistema.varSistema.costoxkm;   
          },
          msg => {
          });
        }  
      });
    } 

    if (route) {
      this.ruta = route;
    }
  }

  consultProducts(products){
    if (this.cartObj.cart != '') {
      for (var i = 0; i < this.cartObj.cart.length; ++i) {
        let index = products.productos.findIndex((items) => items.codigo === this.cartObj.cart[i].codigo);
        if(index !== -1){
          products.productos[index].cantidad = this.cartObj.cart[i].cantidad;
          this.cartObj.cart[i] = products.productos[index];
          this.updateProduct(this.cartObj.cart[i], this.cartObj.cart[i].cantidad.toString()).subscribe(
            success => {
            },
            error => {
            }
          );
        } else {
          this.removeProduct(this.cartObj.cart[i]).subscribe(
            success => {
            },
            error => {
            }
          );
        }
      }
    } 
  }

  addProduct(product, quantity, lat, lng, name) {
    return Observable.create(observer => {
      if(this.cartObj.cart.some(x => x.id === product.id)){
        observer.error('Este producto ya esta incluido en el pedido');
        observer.complete();
      } else{
        product.cantidad = quantity;
        this.cartObj.cart.push(product);
        this.codigos.push({"id": product.id, "codigo": product.codigo});
        this.cartObj.cantidad += 1;  
        this.cartObj.subtotal += parseFloat(product.precio);
        this.cartObj.address.push({"id": product.id, "lat": parseFloat(lat), "lng": parseFloat(lng), "nombre": name, "establecimiento_id": product.establecimiento_id});
        this.storage.setObject('cartMouver', this.cartObj);
        this.storage.setObject('codeMouver', this.codigos);
        observer.next(this.cartObj);
        observer.complete();
      }
    });
  }

  updateProduct(product, quantity) {
    return Observable.create(observer => {
      if(this.cartObj.cart.some(x => x.id === product.id)){
        product.cantidad = quantity;
        this.cartObj.subtotal = 0;
        this.cartObj.cart.forEach((elem) => {
          if (elem.id === product.id){
            this.cartObj.subtotal += parseFloat(product.precio)*quantity;
          } else{
            this.cartObj.subtotal += parseFloat(elem.precio)*elem.cantidad;
          }
        });
        if (isNaN(this.cartObj.subtotal)) {  
          observer.error('Ingrese una cantidad válida');
          observer.complete();
        } else {
          this.storage.setObject('cartMouver', this.cartObj);
          observer.next(this.cartObj);
          observer.complete();
        }
      } else{
        observer.error('Este producto no está en el pedido');
        observer.complete();
      }
    });
  }

  getCartContents() {
    return this.cartObj.cart;
  }

  getCartCount(){
    return this.cartObj.cantidad;
  }
  
  getCartSubTotal(){
    return this.cartObj.subtotal.toFixed(2);
  }

  getCartId(){
    return this.cartObj.id;
  }

  getCartLocations(){
    return this.cartObj.address;
  }

  getDireccion(){
    return this.cartObj.direccion;
  }

  getDistance(){
    return this.cartObj.distance;
  }

  getDelivery(){
    return this.cartObj.delivery;
  }

  getDuration(){
    return this.cartObj.time;
  }

  getRoute(){
    return this.ruta;
  }
 
  removeProduct(product) {
    return Observable.create(observer => {
      let index = this.cartObj.cart.findIndex((item) => item.id === product.id);
      if(index !== -1){
        this.cartObj.cart.splice(index, 1);
        this.cartObj.cantidad -= 1;  
        this.cartObj.subtotal -= parseFloat(product.precio)*product.cantidad;
        
        let index1 = this.codigos.findIndex((item1) => item1.codigo === product.codigo);
        if(index1 !== -1){
          this.codigos.splice(index1, 1);
          this.storage.setObject('codeMouver', this.codigos);
        }

        let indexA = this.cartObj.address.findIndex((itemA) => itemA.id === product.id);
        if(indexA !== -1){
          this.cartObj.address.splice(indexA, 1);
        }
       
        if (this.cartObj.cantidad === 0) {
          this.storage.remove('cartMouver');
        } else {
          this.storage.setObject('cartMouver', this.cartObj);
        }
        observer.next(this.cartObj);
        observer.complete();
      } else{
        observer.error('Este servicio no esta incluido en el pedido');
        observer.complete(); 
      }
    });
  }

  setDireccion(dir, lat, lng){
    this.cartObj.direccion.direccion = dir;
    this.cartObj.direccion.lat = lat;
    this.cartObj.direccion.lng = lng;
    this.storage.setObject('cartMouver', this.cartObj);
  }

  setDistance(dist){
    this.cartObj.distance = dist;
    this.cartObj.delivery = (dist * this.costokm).toFixed(2);
    this.storage.setObject('cartMouver', this.cartObj);
  }

  setTime(time){
    this.cartObj.time = time;
    this.storage.setObject('cartMouver', this.cartObj);
  }

  setTotal(subtotal, dist){
    this.cartObj.total = (parseFloat(subtotal) + parseFloat(dist)).toFixed(2);
  }

  setRoute(route){
    this.ruta = route;
    this.storage.setObject('routeMouver', this.ruta);
  }

  deleteCar(){
    this.cartObj.cart = [];
    this.cartObj.address = [];
    this.cartObj.subtotal = 0;
    this.cartObj.cantidad = 0;
    this.codigos = [];
    this.cartObj.direccion = {direccion: '', lat: 0, lng: 0};
    this.cartObj.distance = 0;
    this.cartObj.delivery = 0;
    this.cartObj.time = 0;
    this.cartObj.total = 0;
    this.storage.setObject('cartMouver',this.cartObj);
    this.storage.setObject('codeMouver', this.codigos);
    this.storage.setObject('routeMouver', '');
  }
}

