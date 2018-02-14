import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {
  storage = localStorage;

  constructor(public http: HttpClient) {
  }

  get(key) {
    return this.storage.getItem(key);
  }
  
  set(key, value) {
    this.storage.setItem(key, value);
  }
  
  getObject(key) {
    let value = this.get(key);
    let returnValue;
    if(value) {
      returnValue = JSON.parse(value);
    } else {
      returnValue = null;
    }
    return returnValue;
  }
  
  setObject(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  
  remove(key) {
    this.storage.removeItem(key);
  }
}
