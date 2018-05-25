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
import { StorageProvider } from '../storage/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../rute-base/rute-base';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
var CartProvider = /** @class */ (function () {
    function CartProvider(storage, http, rutebaseApi) {
        var _this = this;
        this.storage = storage;
        this.http = http;
        this.rutebaseApi = rutebaseApi;
        this.cartObj = {};
        this.codigos = [];
        this.costokm = 1;
        this.ruta = [];
        var code = this.storage.getObject('codeMouver');
        var item = this.storage.getObject('cartMouver');
        var user_id = this.storage.getObject('userMouver');
        var route = this.storage.getObject('routeMouver');
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
        }
        else {
            this.codigos = [];
            this.cartObj.cart = [];
            this.cartObj.address = [];
            this.cartObj.subtotal = 0;
            this.cartObj.cantidad = 0;
            this.cartObj.id = user_id.id;
            this.cartObj.direccion = { direccion: '', lat: 0, lng: 0 };
            this.cartObj.distance = 0;
            this.cartObj.time = 0;
            this.cartObj.delivery = 0;
            this.cartObj.total = 0;
        }
        if (code) {
            this.codigos = code;
            this.http.get(this.rutebaseApi.getRutaApi() + 'productos/buscar/codigos?codigos=' + JSON.stringify(this.codigos))
                .toPromise()
                .then(function (data) {
                _this.products = data;
                _this.consultProducts(_this.products);
            }, function (msg) {
                _this.codigos = [];
                _this.cartObj.cart = [];
                _this.cartObj.address = [];
                _this.cartObj.subtotal = 0;
                _this.cartObj.cantidad = 0;
                _this.cartObj.id = user_id.id;
                _this.cartObj.direccion = { direccion: '', lat: 0, lng: 0 };
                _this.cartObj.distance = 0;
                _this.cartObj.time = 0;
                _this.cartObj.delivery = 0;
                _this.cartObj.total = 0;
                _this.cartObj.ruta = [];
            });
        }
        if (route) {
            this.ruta = route;
        }
    }
    CartProvider.prototype.consultProducts = function (products) {
        var _this = this;
        if (this.cartObj.cart != '') {
            for (var i = 0; i < this.cartObj.cart.length; ++i) {
                var index = products.productos.findIndex(function (items) { return items.codigo === _this.cartObj.cart[i].codigo; });
                if (index !== -1) {
                    products.productos[index].cantidad = this.cartObj.cart[i].cantidad;
                    this.cartObj.cart[i] = products.productos[index];
                    this.updateProduct(this.cartObj.cart[i], this.cartObj.cart[i].cantidad.toString()).subscribe(function (success) {
                    }, function (error) {
                    });
                }
                else {
                    this.removeProduct(this.cartObj.cart[i]).subscribe(function (success) {
                    }, function (error) {
                    });
                }
            }
        }
    };
    CartProvider.prototype.addProduct = function (product, quantity, lat, lng, name) {
        var _this = this;
        return Observable.create(function (observer) {
            if (_this.cartObj.cart.some(function (x) { return x.id === product.id; })) {
                observer.error('Este producto ya esta incluido en el pedido');
                observer.complete();
            }
            else {
                product.cantidad = quantity;
                _this.cartObj.cart.push(product);
                _this.codigos.push({ "id": product.id, "codigo": product.codigo });
                _this.cartObj.cantidad += 1;
                _this.cartObj.subtotal += parseFloat(product.precio);
                _this.cartObj.address.push({ "id": product.id, "lat": parseFloat(lat), "lng": parseFloat(lng), "nombre": name, "establecimiento_id": product.establecimiento_id });
                _this.storage.setObject('cartMouver', _this.cartObj);
                _this.storage.setObject('codeMouver', _this.codigos);
                observer.next(_this.cartObj);
                observer.complete();
            }
        });
    };
    CartProvider.prototype.updateProduct = function (product, quantity) {
        var _this = this;
        return Observable.create(function (observer) {
            if (_this.cartObj.cart.some(function (x) { return x.id === product.id; })) {
                product.cantidad = quantity;
                _this.cartObj.subtotal = 0;
                _this.cartObj.cart.forEach(function (elem) {
                    if (elem.id === product.id) {
                        _this.cartObj.subtotal += parseFloat(product.precio) * quantity;
                    }
                    else {
                        _this.cartObj.subtotal += parseFloat(elem.precio) * elem.cantidad;
                    }
                });
                if (isNaN(_this.cartObj.subtotal)) {
                    observer.error('Ingrese una cantidad válida');
                    observer.complete();
                }
                else {
                    _this.storage.setObject('cartMouver', _this.cartObj);
                    observer.next(_this.cartObj);
                    observer.complete();
                }
            }
            else {
                observer.error('Este producto no está en el pedido');
                observer.complete();
            }
        });
    };
    CartProvider.prototype.getCartContents = function () {
        return this.cartObj.cart;
    };
    CartProvider.prototype.getCartCount = function () {
        return this.cartObj.cantidad;
    };
    CartProvider.prototype.getCartSubTotal = function () {
        return this.cartObj.subtotal.toFixed(2);
    };
    CartProvider.prototype.getCartId = function () {
        return this.cartObj.id;
    };
    CartProvider.prototype.getCartLocations = function () {
        return this.cartObj.address;
    };
    CartProvider.prototype.getDireccion = function () {
        return this.cartObj.direccion;
    };
    CartProvider.prototype.getDistance = function () {
        return this.cartObj.distance;
    };
    CartProvider.prototype.getDelivery = function () {
        return this.cartObj.delivery;
    };
    CartProvider.prototype.getDuration = function () {
        return this.cartObj.time;
    };
    CartProvider.prototype.getRoute = function () {
        return this.ruta;
    };
    CartProvider.prototype.removeProduct = function (product) {
        var _this = this;
        return Observable.create(function (observer) {
            var index = _this.cartObj.cart.findIndex(function (item) { return item.id === product.id; });
            if (index !== -1) {
                _this.cartObj.cart.splice(index, 1);
                _this.cartObj.cantidad -= 1;
                _this.cartObj.subtotal -= parseFloat(product.precio) * product.cantidad;
                var index1 = _this.codigos.findIndex(function (item1) { return item1.codigo === product.codigo; });
                if (index1 !== -1) {
                    _this.codigos.splice(index1, 1);
                    _this.storage.setObject('codeMouver', _this.codigos);
                }
                var indexA = _this.cartObj.address.findIndex(function (itemA) { return itemA.id === product.id; });
                if (indexA !== -1) {
                    _this.cartObj.address.splice(indexA, 1);
                }
                if (_this.cartObj.cantidad === 0) {
                    _this.storage.remove('cartMouver');
                }
                else {
                    _this.storage.setObject('cartMouver', _this.cartObj);
                }
                observer.next(_this.cartObj);
                observer.complete();
            }
            else {
                observer.error('Este servicio no esta incluido en el pedido');
                observer.complete();
            }
        });
    };
    CartProvider.prototype.setDireccion = function (dir, lat, lng) {
        this.cartObj.direccion.direccion = dir;
        this.cartObj.direccion.lat = lat;
        this.cartObj.direccion.lng = lng;
        this.storage.setObject('cartMouver', this.cartObj);
    };
    CartProvider.prototype.setDistance = function (dist) {
        this.cartObj.distance = dist;
        this.cartObj.delivery = (dist * this.costokm).toFixed(2);
        this.storage.setObject('cartMouver', this.cartObj);
    };
    CartProvider.prototype.setTime = function (time) {
        this.cartObj.time = time;
        this.storage.setObject('cartMouver', this.cartObj);
    };
    CartProvider.prototype.setTotal = function (subtotal, dist) {
        this.cartObj.total = (parseFloat(subtotal) + parseFloat(dist)).toFixed(2);
    };
    CartProvider.prototype.setRoute = function (route) {
        this.ruta = route;
        this.storage.setObject('routeMouver', this.ruta);
        console.log(this.ruta);
    };
    CartProvider.prototype.deleteCar = function () {
        this.cartObj.cart = [];
        this.cartObj.address = [];
        this.cartObj.subtotal = 0;
        this.cartObj.cantidad = 0;
        this.codigos = [];
        this.cartObj.direccion = { direccion: '', lat: 0, lng: 0 };
        this.cartObj.distance = 0;
        this.cartObj.delivery = 0;
        this.cartObj.time = 0;
        this.cartObj.total = 0;
        this.storage.setObject('cartMouver', this.cartObj);
        this.storage.setObject('codeMouver', this.codigos);
        this.storage.setObject('routeMouver', '');
    };
    CartProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [StorageProvider, HttpClient, RuteBaseProvider])
    ], CartProvider);
    return CartProvider;
}());
export { CartProvider };
//# sourceMappingURL=cart.js.map