import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { BlogsRoutingModule, routedComponents } from './blogs-routing.module';

//Mis imports
import { LoadingModule, ANIMATION_TYPES  } from 'ngx-loading';
import { ToasterModule } from 'angular2-toaster';

import { RelativeTimePipe } from '../../pipes/relative-time/relative-time';

@NgModule({
  imports: [
    ToasterModule,
    ThemeModule,
    BlogsRoutingModule,
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
    RelativeTimePipe
  ],
   providers: [

  ],
})
export class BlogsModule { }
