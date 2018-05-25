var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartProvider } from '../cart/cart';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
var LocationsProvider = /** @class */ (function () {
    function LocationsProvider(http, cartProvider) {
        this.http = http;
        this.cartProvider = cartProvider;
        this.locat = [];
        this.ruta = [];
        this.cont = 0;
        /*this.location_cart = this.cartProvider.getCartLocations();
        this.locations = this.location_cart.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.lat === thing.lat && t.lng === thing.lng
          ))
        );
        console.log(this.locations);*/
    }
    LocationsProvider.prototype.load = function (myLocation) {
        var _this = this;
        return Observable.create(function (observer) {
            _this.location_cart = _this.cartProvider.getCartLocations();
            _this.locations = _this.location_cart.filter(function (thing, index, self) {
                return index === self.findIndex(function (t) { return (t.lat === thing.lat && t.lng === thing.lng); });
            });
            _this.locat = [];
            _this.ruta = [];
            _this.cont = 0;
            _this.data = _this.applyHaversine(_this.locations, myLocation);
            _this.data.map(function (location) {
                _this.cont += 1;
                _this.locat.push({ location: { lat: location.lat, lng: location.lng }, stopover: true });
                _this.ruta.push({ lat: location.lat, lng: location.lng, posicion: _this.cont, establecimiento_id: location.establecimiento_id });
            });
            _this.cartProvider.setRoute(_this.ruta);
            observer.next(_this.locat);
            observer.complete();
        });
    };
    LocationsProvider.prototype.applyHaversine = function (locations, myLocation) {
        var _this = this;
        this.locat = [];
        this.ruta = [];
        this.cont = 0;
        var usersLocation = {
            lat: myLocation.lat,
            lng: myLocation.lng
        };
        locations.map(function (location) {
            var placeLocation = {
                lat: location.lat,
                lng: location.lng
            };
            location.distance = _this.getDistanceBetweenPoints(usersLocation, placeLocation, 'km').toFixed(2);
        });
        locations.sort(function (locationA, locationB) {
            return locationB.distance - locationA.distance;
        });
        return locations;
    };
    LocationsProvider.prototype.getDistanceBetweenPoints = function (start, end, units) {
        var earthRadius = {
            miles: 3958.8,
            km: 6371
        };
        var R = earthRadius[units || 'miles'];
        var lat1 = start.lat;
        var lon1 = start.lng;
        var lat2 = end.lat;
        var lon2 = end.lng;
        var dLat = this.toRad((lat2 - lat1));
        var dLon = this.toRad((lon2 - lon1));
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };
    LocationsProvider.prototype.toRad = function (x) {
        return x * Math.PI / 180;
    };
    LocationsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, CartProvider])
    ], LocationsProvider);
    return LocationsProvider;
}());
export { LocationsProvider };
//# sourceMappingURL=locations.js.map