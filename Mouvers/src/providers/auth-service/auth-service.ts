import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {StorageProvider} from '../storage/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthServiceProvider {

  usuario: any;

  constructor(public http: HttpClient, public storage: StorageProvider) {}
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.post('http://mouvers.mx/mouversAPI/public/login/app', credentials)
        .toPromise()
        .then(
          data => {
            this.usuario = data;
            this.storage.set('tokenMouver',this.usuario.token);
            this.storage.setObject('userMouver', this.usuario.user);
            observer.next(true);
            observer.complete();
          },
          msg => {
            observer.error(msg.error);
            observer.complete();
          }); 
      });
    }
  }

  public loginSocial(credentials) {
    if (credentials.email === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.post('http://mouvers.mx/mouversAPI/public/login/app', credentials)
        .toPromise()
        .then(
          data => {
            this.usuario = data;
            this.storage.set('tokenMouver',this.usuario.token);
            this.storage.setObject('userMouver', this.usuario.user);
            observer.next(true);
            observer.complete();
          },
          msg => {
            observer.error(msg.error);
            observer.complete();
          }); 
      });
    }
  }

  public registerSocial(credentials) {
    if (credentials.nombre === null || credentials.telefono === null || credentials.email === null || credentials.password === null || credentials.ciudad === null || credentials.estado === null || credentials.rpassword === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
      	this.http.post('http://mouvers.mx/mouversAPI/public/usuarios', credentials)
		.toPromise()
		.then(
		data => {
      this.usuario = data;
      this.storage.set('tokenMouver',this.usuario.token);
      this.storage.setObject('userMouver', this.usuario.user);
			observer.next(data);
			observer.complete();
		},
		msg => {
			observer.error(msg.error);
			observer.complete();
		});
      });
    }
  }

  public register(credentials) {
    if (credentials.nombre === null || credentials.telefono === null || credentials.email === null || credentials.password === null || credentials.ciudad === null || credentials.estado === null || credentials.rpassword === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
      	this.http.post('http://mouvers.mx/mouversAPI/public/usuarios', credentials)
		.toPromise()
		.then(
		data => {
			observer.next(data);
			observer.complete();
		},
		msg => {
			observer.error(msg.error);
			observer.complete();
		});
      });
    }
  }
 
  public getUserInfo() {
    return this.storage.getObject('userMouver');
  }
 
  public logout() {
    return Observable.create(observer => {
      observer.next(true);
      observer.complete();
    });
  }
}