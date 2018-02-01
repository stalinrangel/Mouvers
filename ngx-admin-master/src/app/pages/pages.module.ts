import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginModule } from '../login/login.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';

import  { LoginComponent } from '../login/login.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
   // LoginModule

  ],
  declarations: [
    ...PAGES_COMPONENTS,
    //LoginComponent
    
  ],
})
export class PagesModule {
}
