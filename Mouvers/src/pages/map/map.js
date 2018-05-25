var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, App, NavParams, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PaymentsPage } from '../payments/payments';
import { LocationsProvider } from '../../providers/locations/locations';
import { CartProvider } from '../../providers/cart/cart';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
var MapPage = /** @class */ (function () {
    function MapPage(navCtrl, app, http, rutebaseAPI, navParams, geolocation, platform, loadingCtrl, toastCtrl, location, cartProvider, storage) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.http = http;
        this.rutebaseAPI = rutebaseAPI;
        this.navParams = navParams;
        this.geolocation = geolocation;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.location = location;
        this.cartProvider = cartProvider;
        this.storage = storage;
        this.myPosition = {};
        this.refresh = false;
        this.directionsService = null;
        this.directionsDisplay = null;
        this.geocoder = null;
        this.infowindow = null;
        this.bounds = null;
        this.waypoints = [];
        this.markers = [];
        this.inside = false;
        this.areaTriangle = null;
        this.triangleCoords = [];
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        this.areaTriangle = new google.maps.Polygon({
            paths: this.triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00ff00',
            fillOpacity: 0
        });
        this.geocoder = new google.maps.Geocoder;
        this.infowindow = new google.maps.InfoWindow;
        this.bounds = new google.maps.LatLngBounds();
        this.getCoordinates();
    }
    MapPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.getCurrentPosition();
        });
    };
    MapPage.prototype.ionViewDidLeave = function () {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
        this.waypoints = [];
    };
    MapPage.prototype.getCurrentPosition = function () {
        var _this = this;
        this.showLoadingGeo();
        var optionsGPS = { timeout: 13000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(optionsGPS)
            .then(function (position) {
            _this.myPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            _this.refresh = false;
            _this.loadMap(position);
        })
            .catch(function (error) {
            _this.loading.dismiss();
            _this.refresh = true;
            _this.presentToast('Active el GPS para encontrar su ubicación', 3500);
        });
    };
    MapPage.prototype.getCoordinates = function () {
        var _this = this;
        this.http.get(this.rutebaseAPI.getRutaApi() + 'coordenadas?token=' + this.storage.get('tokenMouver'))
            .toPromise()
            .then(function (data) {
            _this.datosC = data;
            _this.triangleCoords = _this.datosC.coordenadas;
        }, function (msg) {
            if (msg.status == 400 || msg.status == 401) {
                _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo', 3000);
                _this.app.getRootNav().setRoot(LoginPage);
            }
        });
    };
    MapPage.prototype.loadMap = function (position) {
        var _this = this;
        this.loading.dismiss();
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var mapEle = document.getElementById('map');
        this.myLatLng = { lat: latitude, lng: longitude };
        this.map = new google.maps.Map(mapEle, {
            center: this.myLatLng,
            zoom: 18
        });
        this.directionsDisplay.setMap(this.map);
        this.areaTriangle.setMap(this.map);
        google.maps.event.addListenerOnce(this.map, 'idle', function () {
            mapEle.classList.add('show-map');
            _this.location.load(_this.myLatLng).subscribe(function (success) {
                if (success) {
                    var data = success;
                    console.log(data);
                    _this.origin = new google.maps.LatLng(data[0].location.lat, data[0].location.lng);
                    var end = new google.maps.LatLng(_this.myLatLng.lat, _this.myLatLng.lng);
                    for (var i = 1; i < data.length; ++i) {
                        _this.waypoints.push(data[i]);
                    }
                    _this.calculateRoute(end);
                    _this.inside = google.maps.geometry.poly.containsLocation(end, _this.areaTriangle);
                    if (!_this.inside) {
                        _this.presentToast2('¡Lo sentimos! Por el momento Möuvers no puede llegar a esta dirección, Por favor mueve el pin rojo a otra ubicación');
                    }
                }
                else {
                    _this.presentToast('Ha ocurrido un error intenta de nuevo', 3000);
                }
            }, function (error) {
                _this.presentToast(error, 1500);
            });
        });
    };
    MapPage.prototype.calculateRoute = function (end) {
        var _this = this;
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.bounds.extend(this.origin);
        this.waypoints.forEach(function (waypoint) {
            var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
            _this.bounds.extend(point);
        });
        this.bounds.extend(end);
        this.map.fitBounds(this.bounds);
        this.createMarker(this.origin, 'start', false, 'assets/imgs/store.png', this.dirOrigin);
        this.createMarker(end, 'end', true, 'assets/imgs/pin.png', 'destino');
        this.directionsService.route({
            origin: this.origin,
            destination: end,
            waypoints: this.waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                _this.directionsDisplay.setDirections(response);
                var route = response.routes[0];
                for (var i = 1; i < route['legs'].length; i++) {
                    _this.waypoints[i - 1].location = route['legs'][i].start_location;
                }
                for (var j = 0; j < _this.waypoints.length; j++) {
                    _this.createMarker(_this.waypoints[j].location, j, false, 'assets/imgs/store.png', 'Establecimiento');
                }
                _this.computeTotalDistance(response);
            }
            else {
                console.log('Could not display directions due to: ' + status);
            }
        });
    };
    MapPage.prototype.createMarker = function (latlng, posRef, draggable, icons, title) {
        var icon = {
            url: icons,
            scaledSize: new google.maps.Size(30, 30)
        };
        var marker = new google.maps.Marker({
            position: latlng,
            map: this.map,
            draggable: draggable,
            posRef: posRef,
            icon: icon,
            title: 'Establecimiento'
        });
        if (posRef == 'end') {
            this.geocodeLatLng(this.geocoder, this.map, marker, this.infowindow, latlng);
        }
        this.markers.push(marker);
        var that = this;
        google.maps.event.addListener(marker, 'dragend', function () {
            var _this = this;
            if (this.posRef == 'end') {
                var end = this.getPosition();
                that.myLatLng = { lat: end.lat(), lng: end.lng() };
                that.waypoints = [];
                that.location.load(that.myLatLng).subscribe(function (success) {
                    if (success) {
                        var data = success;
                        that.origin = new google.maps.LatLng(data[0].location.lat, data[0].location.lng);
                        for (var i = 1; i < data.length; ++i) {
                            that.waypoints.push(data[i]);
                        }
                        that.calculateRoute(end);
                        that.geocodeLatLng(that.geocoder, that.map, _this, that.infowindow, end);
                        that.inside = google.maps.geometry.poly.containsLocation(end, that.areaTriangle);
                        if (!that.inside) {
                            that.presentToast2('¡Lo sentimos! Por el momento Möuvers no puede llegar a esta dirección, Por favor mueve el pin rojo a otra ubicación');
                        }
                    }
                    else {
                        that.presentToast('Ha ocurrido un error intenta de nuevo', 3000);
                    }
                }, function (error) {
                    _this.presentToast(error, 1500);
                });
            }
        });
    };
    MapPage.prototype.geocodeLatLng = function (geocoder, map, marker, infowindow, end) {
        var that = this;
        geocoder.geocode({ 'location': end }, function (results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    infowindow.setContent(results[1].formatted_address);
                    infowindow.open(map, marker);
                    that.cartProvider.setDireccion(results[1].formatted_address, end.lat(), end.lng());
                }
                else {
                    infowindow.setContent('No se ha podido ubicar la dirección');
                    infowindow.open(map, marker);
                }
            }
            else {
                infowindow.setContent('No se ha podido ubicar la dirección');
                infowindow.open(map, marker);
            }
        });
    };
    MapPage.prototype.computeTotalDistance = function (result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
            total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        this.cartProvider.setDistance(total);
    };
    MapPage.prototype.gotoPayment = function () {
        this.navCtrl.push(PaymentsPage);
    };
    MapPage.prototype.showLoadingGeo = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Buscando Ubicación...',
            spinner: 'ios'
        });
        this.loading.present();
    };
    MapPage.prototype.presentToast = function (text, time) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: time,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    MapPage.prototype.presentToast2 = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            position: 'top',
            duration: 3000
        });
        toast.onDidDismiss(function () {
        });
        toast.present();
    };
    MapPage = __decorate([
        Component({
            selector: 'page-map',
            templateUrl: 'map.html',
        }),
        __metadata("design:paramtypes", [NavController, App, HttpClient, RuteBaseProvider, NavParams, Geolocation, Platform, LoadingController, ToastController, LocationsProvider, CartProvider, StorageProvider])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map