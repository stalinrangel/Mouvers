import { Component, NgModule, Injectable, EventEmitter, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Injectable()
export class ViewHeaderEventService {

  	viewHeaderData = new EventEmitter<any>();

	//constructor() { }

}
