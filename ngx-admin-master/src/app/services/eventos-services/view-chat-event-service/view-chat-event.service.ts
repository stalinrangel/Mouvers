import { Component, NgModule, Injectable, EventEmitter, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Injectable()
export class ViewChatEventService {

	viewChatData = new EventEmitter<any>();

	//constructor() { }

}
