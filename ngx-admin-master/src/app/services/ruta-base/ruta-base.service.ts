import { Injectable } from '@angular/core';

@Injectable()
export class RutaBaseService {

	//Local freddy
	public api_base = 'http://localhost/gitHub/Mouvers/';
	public images_base = 'http://localhost/gitHub/Mouvers/images_uploads/';

	//Remoto
	//public api_base = 'http://mouvers.mx/';
	//public images_base = 'http://mouvers.mx/images_uploads/';

	constructor() { }

	getRutaApi(){
		return this.api_base;
	}

	getRutaImages(){
		return this.images_base;
}

}
