import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstablecimientosComponent } from './establecimientos.component';
import { EstablecimientosVerComponent } from './establecimientos-ver/establecimientos-ver.component';
import { EstablecimientosAgregarComponent } from './establecimientos-agregar/establecimientos-agregar.component';

const routes: Routes = [{
  path: '',
  component: EstablecimientosComponent,
  children: [{
    path: 'ver',
    component: EstablecimientosVerComponent,
  },{
    path: 'agregar',
    component: EstablecimientosAgregarComponent,
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class EstablecimientosRoutingModule {

}

export const routedComponents = [
  EstablecimientosComponent,
  EstablecimientosVerComponent,
  EstablecimientosAgregarComponent,
];
