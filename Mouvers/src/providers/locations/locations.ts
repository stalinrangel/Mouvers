import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartProvider } from '../cart/cart';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocationsProvider {

	location_cart: any;
    locations: any;
	data: any;
	locat: any = [];
    ruta: any = [];
    cont: number = 0;

	constructor(public http: HttpClient, public cartProvider: CartProvider) {
		/*this.location_cart = this.cartProvider.getCartLocations();
        this.locations = this.location_cart.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.lat === thing.lat && t.lng === thing.lng
          ))
        );
        console.log(this.locations);*/
    }
 	
 	load(myLocation){
        return Observable.create(observer => {
            this.location_cart = this.cartProvider.getCartLocations();
            this.locations = this.location_cart.filter((thing, index, self) =>
              index === self.findIndex((t) => (
                t.lat === thing.lat && t.lng === thing.lng
              ))
            );
            this.locat = [];
            this.ruta = [];
            this.cont = 0;
		    this.data = this.applyHaversine(this.locations, myLocation);           
            this.data.map((location) => {
                this.cont += 1;
                this.locat.push({location:{lat:location.lat, lng: location.lng}, stopover: true});
                this.ruta.push({lat:location.lat, lng: location.lng, posicion: this.cont, establecimiento_id: location.establecimiento_id});
            });
            this.cartProvider.setRoute(this.ruta);
            observer.next(this.locat);
	        observer.complete();
	    });
 
    }
 
    applyHaversine(locations, myLocation){
        this.locat = [];
        this.ruta = [];
        this.cont = 0;
        let usersLocation = {
            lat: myLocation.lat,
            lng: myLocation.lng
        };
 
        locations.map((location) => {
            let placeLocation = {
                lat: location.lat,
                lng: location.lng
            };
 
            location.distance = this.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'km'
            ).toFixed(2);
        });

        locations.sort((locationA, locationB) => {
            return locationB.distance - locationA.distance;
        });
 
        return locations;
    }
 
    getDistanceBetweenPoints(start, end, units){
 
        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };
 
        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;
 
        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
 
        return d;
 
    }
 
    toRad(x){
        return x * Math.PI / 180;
    }
}
