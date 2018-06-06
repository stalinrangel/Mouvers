import { Component, NgModule, Injectable, EventEmitter, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Injectable()
export class HeaderToBlogEventService {

  	headerToBlogData = new EventEmitter<any>();

	//constructor() { }

}
