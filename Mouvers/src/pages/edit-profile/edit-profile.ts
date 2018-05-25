import { Component } from '@angular/core';
import { Platform, App, NavController, NavParams, LoadingController, Loading, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { LoginPage } from '../login/login';

declare var cordova: any;

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

	user: any = {};
	loading: Loading;
	public city: string = 'Ciudad';
	public registerUserForm: FormGroup;
	public estados: any;
	public ciudades: any = [];
	public datos: any;
	public datosU: any;
	public createSuccess: boolean = false;
	formErrors = {
		'nombre': '',
		'telefono': '',
		'email': '',
		'ciudad': '',
		'estado': ''
	};
	public lastImage: string = null;
	public image_user: string = '/assets/imgs/user-white.png'

	constructor(public navCtrl: NavController, public app:App, public navParams: NavParams, private http: HttpClient, private loadingCtrl: LoadingController, private builder: FormBuilder, public alertCtrl: AlertController, private toastCtrl: ToastController, private rutebaseApi: RuteBaseProvider, public storage: StorageProvider, private camera: Camera, private file: File, public actionSheetCtrl: ActionSheetController, private platform: Platform, private filePath: FilePath, private transfer: Transfer) {
		this.user = this.storage.getObject('userMouver');
		console.log(this.user);
		this.initForm();
	}

	initForm() {
	    this.registerUserForm = this.builder.group({
	      nombre: [this.user.nombre, [Validators.required, Validators.minLength(2)]],
	      telefono: [this.user.telefono, [Validators.required, Validators.maxLength(10)]],
	      email: [this.user.email, [Validators.required, Validators.email]],
	      imagen: [this.user.imagen],
	      ciudad: [this.user.ciudad, [Validators.required]],
	      estado: [this.user.estado, [Validators.required]],
	      token: [this.storage.get('tokenMouver')]
	    });
	    if (this.user.imagen != null) {
	    	this.image_user = this.user.imagen;
	    }
	    this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
	    this.onValueChanged();
	    this.page();
    }

	page(){
		this.http.get(this.rutebaseApi.getRutaApi() + 'entidades/municipios')
		.toPromise()
		.then(
		  data => {
		    this.datos = data;
		    this.estados = this.datos.entidades; 
		    for (var i = 0; i < this.estados.length; ++i) {
		      if (this.user.estado == this.estados[i].nom_ent) {
		      	this.registerUserForm.patchValue({estado: this.estados[i].nom_ent});
		        this.ciudades = this.estados[i].municipios;
		        for (var j = 0; j < this.ciudades.length; ++j) {
		        	if (this.user.ciudad == this.estados[i].municipios[j].nom_mun) {
		        		this.registerUserForm.patchValue({ciudad: this.estados[i].municipios[j].nom_mun});
		        	}
		        }
		      }
		    }
		    if (this.user.estado === 'Ciudad de México') {
		      this.city = 'Delegación';
		    } else {
		      this.city = 'Ciudad';
		    }
		  },
		  msg => {
		    console.log(msg);
		});
	}

	setEstado(estado){
	    for (var i = 0; i < this.estados.length; ++i) {
	      if (estado == this.estados[i].nom_ent) {
	        this.ciudades = this.estados[i].municipios;
	        this.registerUserForm.patchValue({ciudad: this.estados[i].municipios[0].nom_mun});
	      }
	    }
	    if (estado === 'Ciudad de México') {
	      this.city = 'Delegación';
	    } else {
	      this.city = 'Ciudad';
	    }
	}

	onValueChanged(data?: any) {
	    if (!this.registerUserForm) { return; }
	    const form = this.registerUserForm;

	    for (const field in this.formErrors) { 
	      const control = form.get(field);
	      this.formErrors[field] = '';
	      if (control && control.dirty && !control.valid) {
	        for (const key in control.errors) {
	          this.formErrors[field] += true;
	          console.log(key);
	        }
	      } 
	    }
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
		  const control = formGroup.get(field);
		  if (control instanceof FormControl) {
		    control.markAsDirty({ onlySelf:true });
		    this.onValueChanged();
		  } else if (control instanceof FormGroup) {
		    this.validateAllFormFields(control);
		  }
		});
	}

	public presentActionSheet() {
	    let actionSheet = this.actionSheetCtrl.create({
	      title: 'Seleccione una Imagen',
	      buttons: [
	        {
	          text: 'Cargar de Librería',
	          handler: () => {
	            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
	          }
	        },
	        {
	          text: 'Usar Camara',
	          handler: () => {
	            this.takePicture(this.camera.PictureSourceType.CAMERA);
	          }
	        },
	        {
	          text: 'Cancelar',
	          role: 'cancel'
	        }
	      ]
	    });
	    actionSheet.present();
	}

	public takePicture(sourceType) {
	  // Create options for the Camera Dialog
	  var options = {
	    quality: 100,
	    sourceType: sourceType,
	    saveToPhotoAlbum: false,
	    correctOrientation: true
	  };
	 
	  // Get the data of an image
	  this.camera.getPicture(options).then((imagePath) => {
	    // Special handling for Android library
	    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
	      	this.filePath.resolveNativePath(imagePath)
	        .then(filePath => {
	          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
	          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
	          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	        });
	    } else {
	      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
	      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
	      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	    }
	  }, (err) => {
	    this.presentToast('Error al seleccionar la imagen');
	  });
	}

	// Create a new name for the image
	private createFileName() {
	  var d = new Date(),
	  n = d.getTime(),
	  newFileName =  n + ".jpg";
	  return newFileName;
	}
	 
	// Copy the image to a local folder
	private copyFileToLocalDir(namePath, currentName, newFileName) {
	  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
	    this.lastImage = newFileName;
	    this.uploadImage();
	  }, error => {
	    this.presentToast('Error al guardar la imagen');
	  });
	}
	 
	// Always get the accurate path to your apps folder
	public pathForImage(img) {
	  if (img === null) {
	    return '';
	  } else {
	    return cordova.file.dataDirectory + img;
	  }
	}

	public uploadImage() {
	  // Destination URL
	  var url = "http://mouvers.mx/images_uploads/upload.php";
	 
	  // File for Upload
	  var targetPath = this.pathForImage(this.lastImage);
	 
	  // File name only
	  var filename = this.lastImage;
	 
	  var options = {
	    fileKey: "file",
	    fileName: filename,
	    chunkedMode: false,
	    mimeType: "multipart/form-data",
	    params : {'fileName': filename}
	  };
	 
	  const fileTransfer: TransferObject = this.transfer.create();
	 
	  this.loading = this.loadingCtrl.create({
	    content: 'Subiendo Imagen...',
	    spinner: 'ios'
	  });
	  this.loading.present();
	  // Use the FileTransfer to upload the image
	  fileTransfer.upload(targetPath, url, options).then(data => {
	    this.loading.dismissAll()
	    this.image_user = data.response;
	  }, err => {
	    this.loading.dismissAll()
	    this.presentToast('Error al subir la imagen');
	    this.image_user = this.user.imagen;
	  });
	}

	editProfile(){
		this.registerUserForm.patchValue({email: this.registerUserForm.value.email.toLowerCase()});
		this.registerUserForm.patchValue({imagen: this.image_user});
	    if (this.registerUserForm.valid) {
			this.showLoading('Editando perfil...');
			this.http.put(this.rutebaseApi.getRutaApi() + 'usuarios/'+ this.user.id, this.registerUserForm.value)
			.toPromise()
			.then(
			  data => {
			  	this.datosU = data;
			  	this.storage.setObject('userMouver', this.datosU.usuario);
			    this.loading.dismiss();
			    this.presentToast('Usuario actualizado con éxito')
			    this.navCtrl.pop();
			  },
			  msg => {
			    this.loading.dismiss();
			    if(msg.status == 400 || msg.status == 401){ 
	                this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
	                this.app.getRootNav().setRoot(LoginPage);
	            } else {
	            	this.presentToast(msg.error.error);
	            }
			});
	    } else {
	      	this.validateAllFormFields(this.registerUserForm);
	     	this.presentToast('¡Todos los campos deben estar completos!');
	    }		
	}

	showLoading(text) {
		this.loading = this.loadingCtrl.create({
	  		content: text,
	  		spinner: 'ios',
	  		duration: 20000
		});
		this.loading.present();
	}

	presentToast(text) {
	    let toast = this.toastCtrl.create({
	      message: text,
	      duration: 3000,
	      position: 'top'
	    });

	    toast.onDidDismiss(() => {
	      console.log('Dismissed toast');
	    });

	    toast.present();
	}
}
