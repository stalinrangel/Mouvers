import { Injectable } from '@angular/core';

@Injectable()
export class RutaBaseService {

	//Local freddy
	//public api_base = 'http://localhost/gitHub/Mouvers/';
	//public images_base = 'http://localhost/gitHub/Mouvers/images_uploads/'; //No esta en uso

	//Remoto
	public api_base = 'http://rattios.com/';
	public images_base = 'http://rattios.com/images_uploads/'; //No esta en uso

	constructor() { }

	getRutaApi(){
		return this.api_base;
	}

	getRutaImages(){
		return this.images_base;
}

}
