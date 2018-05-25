import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RuteBaseProvider {

	//Remoto
	public api_base = 'http://mouvers.mx/mouversAPI/public/';

	constructor(public http: HttpClient) {
	}

	getRutaApi(){
		return this.api_base;
	}

}
