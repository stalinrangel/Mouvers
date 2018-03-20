import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { PedidosRoutingModule, routedComponents } from './pedidos-routing.module';

//Mis imports
import { LoadingModule, ANIMATION_TYPES  } from 'ngx-loading';
import { ToasterModule } from 'angular2-toaster';
//import { Ng2UploaderModule } from 'ng2-uploader';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCr8zuLtOO7IoK_rC948rLcqyqsIaZOouY',
      libraries: ["places"]
    }),
    //Ng2UploaderModule,
    ToasterModule,
    ThemeModule,
    PedidosRoutingModule,
    LoadingModule.forRoot({
        animationType: ANIMATION_TYPES.chasingDots,
        backdropBackgroundColour: 'rgba(0,0,0,0.5)', 
        backdropBorderRadius: '4px',
        primaryColour: '#ffffff', 
        secondaryColour: '#ffffff', 
        tertiaryColour: '#ffffff',
        fullScreenBackdrop: true
    })
  ],
  declarations: [
    ...routedComponents,
  ],
   providers: [

  ],
})
export class PedidosModule { }
