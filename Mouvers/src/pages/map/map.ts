import { Component } from '@angular/core';
import { NavController, App, NavParams, Platform, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PaymentsPage } from '../payments/payments';
import { LocationsProvider } from '../../providers/locations/locations';
import { CartProvider } from '../../providers/cart/cart';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider} from '../../providers/storage/storage';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {

	map: any;
	mark: any;
	myPosition: any = {};
	address: any;
	refresh: boolean = false;
	loading: Loading;
	directionsService: any = null;
	directionsDisplay: any = null;
	geocoder: any = null;
	infowindow: any = null;
	bounds: any = null;
	myLatLng: any;
	waypoints: any[] = [];
	locations: any;
	markers: any[] = [];
	origin: any;
	dirOrigin: string;
	inside: boolean = false;
	areaTriangle: any = null;
	datosC: any;
	coordenates: any = [];
	triangleCoords = [];

	constructor(public navCtrl: NavController, public app: App, public http: HttpClient, public rutebaseAPI: RuteBaseProvider, public navParams: NavParams, public geolocation: Geolocation, private platform: Platform, private loadingCtrl: LoadingController, private toastCtrl: ToastController, public location: LocationsProvider, public cartProvider: CartProvider, public storage: StorageProvider) {
		this.directionsService = new google.maps.DirectionsService();
    	this.directionsDisplay = new google.maps.DirectionsRenderer({
    		suppressMarkers: true
    	});
    	this.geocoder = new google.maps.Geocoder;
    	this.infowindow = new google.maps.InfoWindow;
    	this.bounds = new google.maps.LatLngBounds();
	}

	ionViewDidEnter() {  
		this.platform.ready().then(()=>{
			this.getCurrentPosition();
		})
  	}

  	ionViewDidLeave() {
	    for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		}
		this.markers = [];
		this.waypoints = [];
	}

	getCurrentPosition(){
		this.showLoadingGeo();
		let optionsGPS = {timeout: 13000, enableHighAccuracy: true};
		this.geolocation.getCurrentPosition(optionsGPS)
		.then(position => {
		  this.myPosition = {
		    lat: position.coords.latitude,
		    lng: position.coords.longitude
		  }
		  this.refresh = false;
		  if (this.triangleCoords.length > 0) {
		  	this.loadMap(this.myPosition);
		  } else {
		  	this.getCoordinates(this.myPosition);
		  }
		})
		.catch((error) => {
		  this.loading.dismiss();
		  this.refresh = true;
		  this.presentToast('Active el GPS para encontrar su ubicación',3500);
		})
	}

	getCoordinates(position){
		this.http.get(this.rutebaseAPI.getRutaApi()+'coordenadas?token='+this.storage.get('tokenMouver'))
		.toPromise()
		.then(
		data => {
		    this.datosC = data;
		    this.triangleCoords = this.datosC.coordenadas;
		    this.areaTriangle = new google.maps.Polygon({
			    paths: this.triangleCoords,
			    strokeColor: '#FF0000',
			    strokeOpacity: 0.8,
			    strokeWeight: 2,
			    fillColor: '#00ff00',
			    fillOpacity: 0
			});
			this.loadMap(position);
		},
		msg => {
		    if(msg.status == 400 || msg.status == 401){ 
                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo',3000);
                this.app.getRootNav().setRoot(LoginPage);  
            }
		});
	}

    loadMap(position){
		this.loading.dismiss();
		let mapEle: HTMLElement = document.getElementById('map');
		this.myLatLng = position;

		this.map = new google.maps.Map(mapEle, {
			center: this.myLatLng,
			zoom: 18
		});

		this.directionsDisplay.setMap(this.map);	
  		this.areaTriangle.setMap(this.map);

		google.maps.event.addListenerOnce(this.map, 'idle', () => {
			mapEle.classList.add('show-map');
			this.location.load(this.myLatLng).subscribe(
		      success => {
		        if (success) {
		            let data = success;
		            this.origin = new google.maps.LatLng(data[0].location.lat, data[0].location.lng);
		            var end = new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng);
		            for (var i = 1; i < data.length; ++i) {
		           		this.waypoints.push(data[i]);
		            }
		            this.calculateRoute(end);
		            this.inside = google.maps.geometry.poly.containsLocation(end, this.areaTriangle);
		            if (!this.inside) {
		            	this.presentToast2('¡Lo sentimos! Por el momento Möuvers no puede llegar a esta dirección, Por favor mueve el pin rojo a otra ubicación');
		            }
		        } else {
		          this.presentToast('Ha ocurrido un error intenta de nuevo',3000);
		        }
		      },
		      error => {
		        this.presentToast(error,1500);
		      }
		    );
		});
    }

    public calculateRoute(end){
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		}
		this.bounds.extend(this.origin);
		this.waypoints.forEach(waypoint => {
			var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
			this.bounds.extend(point);
		});
		this.bounds.extend(end);
		this.map.fitBounds(this.bounds);
	
		this.createMarker(this.origin, 'start', false, 'assets/imgs/store.png', this.dirOrigin);
		this.createMarker(end, 'end', true, 'assets/imgs/pin.png','destino'); 

		this.directionsService.route({
		    origin: this.origin,
		    destination: end,
		    waypoints: this.waypoints,
		    optimizeWaypoints: true,
		    travelMode: google.maps.TravelMode.DRIVING,
		    avoidTolls: true
		}, (response, status)=> {
		    if(status === google.maps.DirectionsStatus.OK) {
				this.directionsDisplay.setDirections(response);
				var route = response.routes[0];

				for (var i = 1; i < route['legs'].length; i++) {
					this.waypoints[i - 1].location = route['legs'][i].start_location;
				}
				for (var j = 0; j < this.waypoints.length; j++) {
					this.createMarker(this.waypoints[j].location, j, false, 'assets/imgs/store.png', 'Establecimiento');
				}
				this.computeTotalDistance(response);
				this.computeTotalTime(response);
		    }else{
		      console.log('Could not display directions due to: ' + status);
		    }
		}); 
	}

	createMarker(latlng, posRef, draggable, icons, title) {
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
		if(posRef == 'end'){
			this.geocodeLatLng(this.geocoder, this.map, marker, this.infowindow, latlng);
		}
		this.markers.push(marker);
		var that = this;
		google.maps.event.addListener(marker, 'dragend', function() {
			if(this.posRef == 'end'){
				var end = this.getPosition();
				that.myLatLng = {lat:end.lat(), lng: end.lng()};
				that.waypoints = [];
				that.location.load(that.myLatLng).subscribe(
			      success => {
			        if (success) {
			            let data = success;
			            that.origin = new google.maps.LatLng(data[0].location.lat, data[0].location.lng);
			            for (var i = 1; i < data.length; ++i) {
			           		that.waypoints.push(data[i]);
			            }
			            that.calculateRoute(end);
						that.geocodeLatLng(that.geocoder, that.map, this, that.infowindow, end);
			            that.inside = google.maps.geometry.poly.containsLocation(end, that.areaTriangle);
			            if (!that.inside) {
			            	that.presentToast2('¡Lo sentimos! Por el momento Möuvers no puede llegar a esta dirección, Por favor mueve el pin rojo a otra ubicación');
			            }
			        } else {
			          that.presentToast('Ha ocurrido un error intenta de nuevo',3000);
			        }
			      },
			      error => {
			        this.presentToast(error,1500);
			      }
			    );
			}
		});
	}

	geocodeLatLng(geocoder, map, marker, infowindow, end) {
		var that = this;
        geocoder.geocode({'location': end}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
            	infowindow.setContent(results[1].formatted_address);
				infowindow.open(map, marker);
				that.cartProvider.setDireccion(results[1].formatted_address, end.lat(), end.lng());
            } else {
              	infowindow.setContent('No se ha podido ubicar la dirección');
				infowindow.open(map, marker);
            }
          } else {
            	infowindow.setContent('No se ha podido ubicar la dirección');
				infowindow.open(map, marker);
          }
        });
    }

	computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        this.cartProvider.setDistance(total);
    }

    computeTotalTime(result){
    	var total = 0;
    	var myroute = result.routes[0];
    	for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].duration.value;
        }
        total = total / 60;
        this.cartProvider.setTime(total);
    }

	gotoPayment(){
		this.navCtrl.push(PaymentsPage);
	}

	showLoadingGeo() {
		this.loading = this.loadingCtrl.create({
	  		content: 'Buscando Ubicación...',
	  		spinner: 'ios'
		});
		this.loading.present();
	}

	presentToast(text,time) {
	    let toast = this.toastCtrl.create({
	      message: text,
	      duration: time,
	      position: 'top'
	    });

	    toast.onDidDismiss(() => {
	      console.log('Dismissed toast');
	    });

	    toast.present();
	}

	presentToast2(text) {
		let toast = this.toastCtrl.create({
		  message: text,
		  position: 'top',
		  duration: 3000
		});

		toast.onDidDismiss(() => {
		  
		});

		toast.present();
	}
}
