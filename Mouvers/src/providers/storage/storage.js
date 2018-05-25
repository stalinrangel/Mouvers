var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var StorageProvider = /** @class */ (function () {
    function StorageProvider(http) {
        this.http = http;
        this.storage = localStorage;
    }
    StorageProvider.prototype.get = function (key) {
        return this.storage.getItem(key);
    };
    StorageProvider.prototype.set = function (key, value) {
        this.storage.setItem(key, value);
    };
    StorageProvider.prototype.getObject = function (key) {
        var value = this.get(key);
        var returnValue;
        if (value) {
            returnValue = JSON.parse(value);
        }
        else {
            returnValue = null;
        }
        return returnValue;
    };
    StorageProvider.prototype.setObject = function (key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    };
    StorageProvider.prototype.remove = function (key) {
        this.storage.removeItem(key);
    };
    StorageProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], StorageProvider);
    return StorageProvider;
}());
export { StorageProvider };
//# sourceMappingURL=storage.js.map