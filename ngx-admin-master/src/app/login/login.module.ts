import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

//import { ThemeModule } from '../@theme/theme.module';
import { LoginComponent } from './login.component';
//import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
  //  ThemeModule,
    NgxEchartsModule,
    //LoginRoutingModule
  ],
  declarations: [
   //LoginComponent,
  ],
})
export class LoginModule { }
