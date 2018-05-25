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
import { Platform, App, NavController, NavParams, LoadingController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RuteBaseProvider } from '../../providers/rute-base/rute-base';
import { StorageProvider } from '../../providers/storage/storage';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Transfer } from '@ionic-native/transfer';
import { LoginPage } from '../login/login';
var EditProfilePage = /** @class */ (function () {
    function EditProfilePage(navCtrl, app, navParams, http, loadingCtrl, builder, alertCtrl, toastCtrl, rutebaseApi, storage, camera, file, actionSheetCtrl, platform, filePath, transfer) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.navParams = navParams;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.builder = builder;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.rutebaseApi = rutebaseApi;
        this.storage = storage;
        this.camera = camera;
        this.file = file;
        this.actionSheetCtrl = actionSheetCtrl;
        this.platform = platform;
        this.filePath = filePath;
        this.transfer = transfer;
        this.user = {};
        this.city = 'Ciudad';
        this.ciudades = [];
        this.createSuccess = false;
        this.formErrors = {
            'nombre': '',
            'telefono': '',
            'email': '',
            'ciudad': '',
            'estado': ''
        };
        this.lastImage = null;
        this.image_user = '/assets/imgs/user-white.png';
        this.user = this.storage.getObject('userMouver');
        console.log(this.user);
        this.initForm();
    }
    EditProfilePage.prototype.initForm = function () {
        var _this = this;
        this.registerUserForm = this.builder.group({
            nombre: [this.user.nombre, [Validators.required, Validators.minLength(2)]],
            telefono: [this.user.telefono, [Validators.required, Validators.maxLength(10)]],
            email: [this.user.email, [Validators.required, Validators.email]],
            imagen: [this.user.imagen],
            ciudad: [this.user.ciudad, [Validators.required]],
            estado: [this.user.estado, [Validators.required]],
            token: [this.storage.get('tokenMouver')]
        });
        this.image_user = this.user.imagen;
        this.registerUserForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
        this.page();
    };
    EditProfilePage.prototype.page = function () {
        var _this = this;
        this.http.get(this.rutebaseApi.getRutaApi() + 'entidades/municipios')
            .toPromise()
            .then(function (data) {
            _this.datos = data;
            _this.estados = _this.datos.entidades;
            for (var i = 0; i < _this.estados.length; ++i) {
                if (_this.user.estado == _this.estados[i].nom_ent) {
                    _this.registerUserForm.patchValue({ estado: _this.estados[i].nom_ent });
                    _this.ciudades = _this.estados[i].municipios;
                    for (var j = 0; j < _this.ciudades.length; ++j) {
                        if (_this.user.ciudad == _this.estados[i].municipios[j].nom_mun) {
                            _this.registerUserForm.patchValue({ ciudad: _this.estados[i].municipios[j].nom_mun });
                        }
                    }
                }
            }
            if (_this.user.estado === 'Ciudad de México') {
                _this.city = 'Delegación';
            }
            else {
                _this.city = 'Ciudad';
            }
        }, function (msg) {
            console.log(msg);
        });
    };
    EditProfilePage.prototype.setEstado = function (estado) {
        for (var i = 0; i < this.estados.length; ++i) {
            if (estado == this.estados[i].nom_ent) {
                this.ciudades = this.estados[i].municipios;
                this.registerUserForm.patchValue({ ciudad: this.estados[i].municipios[0].nom_mun });
            }
        }
        if (estado === 'Ciudad de México') {
            this.city = 'Delegación';
        }
        else {
            this.city = 'Ciudad';
        }
    };
    EditProfilePage.prototype.onValueChanged = function (data) {
        if (!this.registerUserForm) {
            return;
        }
        var form = this.registerUserForm;
        for (var field in this.formErrors) {
            var control = form.get(field);
            this.formErrors[field] = '';
            if (control && control.dirty && !control.valid) {
                for (var key in control.errors) {
                    this.formErrors[field] += true;
                    console.log(key);
                }
            }
        }
    };
    EditProfilePage.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            var control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty({ onlySelf: true });
                _this.onValueChanged();
            }
            else if (control instanceof FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    EditProfilePage.prototype.presentActionSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Seleccione una Imagen',
            buttons: [
                {
                    text: 'Cargar de Librería',
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Usar Camara',
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    };
    EditProfilePage.prototype.takePicture = function (sourceType) {
        var _this = this;
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        // Get the data of an image
        this.camera.getPicture(options).then(function (imagePath) {
            // Special handling for Android library
            if (_this.platform.is('android') && sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                _this.filePath.resolveNativePath(imagePath)
                    .then(function (filePath) {
                    var correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
                });
            }
            else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
            }
        }, function (err) {
            _this.presentToast('Error al seleccionar la imagen');
        });
    };
    // Create a new name for the image
    EditProfilePage.prototype.createFileName = function () {
        var d = new Date(), n = d.getTime(), newFileName = n + ".jpg";
        return newFileName;
    };
    // Copy the image to a local folder
    EditProfilePage.prototype.copyFileToLocalDir = function (namePath, currentName, newFileName) {
        var _this = this;
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
            _this.lastImage = newFileName;
            _this.uploadImage();
        }, function (error) {
            _this.presentToast('Error al guardar la imagen');
        });
    };
    // Always get the accurate path to your apps folder
    EditProfilePage.prototype.pathForImage = function (img) {
        if (img === null) {
            return '';
        }
        else {
            return cordova.file.dataDirectory + img;
        }
    };
    EditProfilePage.prototype.uploadImage = function () {
        var _this = this;
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
            params: { 'fileName': filename }
        };
        var fileTransfer = this.transfer.create();
        this.loading = this.loadingCtrl.create({
            content: 'Subiendo Imagen...',
            spinner: 'ios'
        });
        this.loading.present();
        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(function (data) {
            _this.loading.dismissAll();
            _this.image_user = data.response;
        }, function (err) {
            _this.loading.dismissAll();
            _this.presentToast('Error al subir la imagen');
            _this.image_user = _this.user.imagen;
        });
    };
    EditProfilePage.prototype.editProfile = function () {
        var _this = this;
        this.registerUserForm.patchValue({ email: this.registerUserForm.value.email.toLowerCase() });
        this.registerUserForm.patchValue({ imagen: this.image_user });
        if (this.registerUserForm.valid) {
            this.showLoading('Editando perfil...');
            this.http.put(this.rutebaseApi.getRutaApi() + 'usuarios', this.registerUserForm.value)
                .toPromise()
                .then(function (data) {
                _this.loading.dismiss();
                _this.presentToast('Usuario actualizado con éxito');
                _this.navCtrl.pop();
            }, function (msg) {
                _this.loading.dismiss();
                if (msg.status == 400 || msg.status == 401) {
                    _this.presentToast(msg.error.error + ', Por favor inicia sesión de nuevo');
                    _this.app.getRootNav().setRoot(LoginPage);
                }
                else {
                    _this.presentToast(msg.error.error);
                }
            });
        }
        else {
            this.validateAllFormFields(this.registerUserForm);
            this.presentToast('¡Todos los campos deben estar completos!');
        }
    };
    EditProfilePage.prototype.showLoading = function (text) {
        this.loading = this.loadingCtrl.create({
            content: text,
            spinner: 'ios',
            duration: 20000
        });
        this.loading.present();
    };
    EditProfilePage.prototype.presentToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    EditProfilePage = __decorate([
        Component({
            selector: 'page-edit-profile',
            templateUrl: 'edit-profile.html',
        }),
        __metadata("design:paramtypes", [NavController, App, NavParams, HttpClient, LoadingController, FormBuilder, AlertController, ToastController, RuteBaseProvider, StorageProvider, Camera, File, ActionSheetController, Platform, FilePath, Transfer])
    ], EditProfilePage);
    return EditProfilePage;
}());
export { EditProfilePage };
//# sourceMappingURL=edit-profile.js.map