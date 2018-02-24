import { NgModule } from '@angular/core';

//Mis imports
import { ThemeModule } from '../../@theme/theme.module';
import { LoginfComponent } from './loginf.component';

import { HttpClientModule } from '@angular/common/http';

import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
  	ToasterModule,
    ThemeModule
  ],
  declarations: [
    LoginfComponent,
    
  ],
})
export class LoginfModule { }
