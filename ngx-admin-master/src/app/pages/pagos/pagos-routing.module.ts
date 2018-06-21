import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagosComponent } from './pagos.component';
import { PagosPendientesComponent } from './pagos-pendientes/pagos-pendientes.component';
import { PagosRealizadosComponent } from './pagos-realizados/pagos-realizados.component';

const routes: Routes = [{
  path: '',
  component: PagosComponent,
  children: [{
    path: 'pendientes',
    component: PagosPendientesComponent,
  },{
    path: 'realizados',
    component: PagosRealizadosComponent,
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
export class PagosRoutingModule {

}

export const routedComponents = [
  PagosComponent,
  PagosPendientesComponent,
  PagosRealizadosComponent,
];
