import { Component, OnInit, ElementRef, ViewChild, HostListener, NgZone } from '@angular/core';

// Mis imports
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { RutaBaseService } from '../../../services/ruta-base/ruta-base.service';

import { FormBuilder, FormArray, FormGroup, Validators, FormControl  } from '@angular/forms';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';

declare const $: any;
declare var google: any;

@Component({
  selector: 'ngx-establecimientos-agregar',
  styleUrls: ['./establecimientos-agregar.component.scss'],
  templateUrl: './establecimientos-agregar.component.html',
})
export class EstablecimientosAgregarComponent implements OnInit{

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

	public loading = false;
	public mostrar = true;

	//Formularios
	myFormAgregar: FormGroup;

  //Mapa
  private zone: NgZone;

  lat: number = 26.047172833607;
  lng: number = -98.292354481476;
  zoom: number = 16;

  public searchControl: FormControl;
  public latitude: number;
  public longitude: number;


  @ViewChild("search")
  public searchElementRef: ElementRef;



  constructor( private toasterService: ToasterService,
           private http: HttpClient,
           private router: Router,
           private rutaService: RutaBaseService,
           public fb: FormBuilder,
           private mapsAPILoader: MapsAPILoader,
           private ngZone: NgZone)
  {

  	this.myFormAgregar = this.fb.group({
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        lat: ['', [Validators.required]],
        lng: ['', [Validators.required]]
      });
  }

  ngOnInit() {
    this.zone = new NgZone({ enableLongStackTrace: false });
    
    //create search FormControl
    this.searchControl = new FormControl();
    
    //set current position
    this.setCurrentPosition();
    
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {

    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(26.077848, -98.375664),
      new google.maps.LatLng(26.077543, -98.276901),
      new google.maps.LatLng(26.058949, -98.283691),
      new google.maps.LatLng(26.041180, -98.366295)
    );

    var options = { 
      bounds: defaultBounds,
      //componentRestrictions: {country: "AR"}
      //types: ['(cities)'],
      //componentRestrictions: {country: 'fr'}
    };
    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ["address"]
    }, options);
     var circle = new google.maps.Circle({
            center: {lat:  26.047172833607, lng: -98.292354481476},
            radius: 10*1000
          });
          autocomplete.setBounds(circle.getBounds());
      autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        console.log(place.formatted_address);
        this.myFormAgregar.patchValue({direccion: place.formatted_address });
        //console.log(place.address_components[0].long_name);
        //set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.myFormAgregar.patchValue({lat: place.geometry.location.lat() });
        this.longitude = place.geometry.location.lng();
        this.myFormAgregar.patchValue({lng: place.geometry.location.lng() });
        this.zoom = 11;

        console.log(this.myFormAgregar.value.direccion);

      });
    });
  });
  }

  public setDir(dir){
    return Observable.create(observer => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': dir}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                console.log(results[1]);
                //alert(JSON.stringify(results[1].formatted_address));
                //this.setDir(results[1].formatted_address);
                 observer.next(results[1].formatted_address);
                 observer.complete();
                
              } else {
                alert('No results found');
                observer.next({});
                observer.complete();
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              observer.next({});
              observer.complete();
            }
          });
       })
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    var latlng:any;
    
    latlng=$event;
    latlng=latlng.coords;
    this.myFormAgregar.patchValue({lat: latlng.lat });
    this.myFormAgregar.patchValue({lng: latlng.lng });

    this.setDir(latlng).subscribe(result => {
      this.myFormAgregar.patchValue({direccion: result });
      },error => console.log(error),() => console.log('Geocoding completed!')
    );
    
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  uppercase(value: string) {
    //console.log(value);
    return value.toUpperCase();
  }

  setDireccion(){
      setTimeout(()=>{
        this.myFormAgregar.patchValue({direccion: this.myFormAgregar.value.direccion });
      },500)
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



    crear() {
      console.log(this.myFormAgregar.value);
      
      this.loading = true;

      var datos= {
        token: localStorage.getItem('mouvers_token'),
        nombre: this.myFormAgregar.value.nombre,
        direccion: this.myFormAgregar.value.direccion,
        lat: this.myFormAgregar.value.lat,
        lng: this.myFormAgregar.value.lng,
        estado: 'ON',
      }

      this.http.post(this.rutaService.getRutaApi()+'mouversAPI/public/establecimientos', datos)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;

              //alert(this.data.message);
              this.loading = false;
              this.showToast('success', 'Success!', this.data.message);

              this.myFormAgregar.reset();
  
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
                  //this.mostrar = false;
              }
              else { 
                  //alert(msg.error.error);
                  this.showToast('error', 'Erro!', msg.error.error);
              }
           }
         );
    }


}
