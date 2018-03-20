import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './pedidos.component';
import { PedidosHistorialComponent } from './pedidos-historial/pedidos-historial.component';
import { PedidosHoyComponent } from './pedidos-hoy/pedidos-hoy.component';

const routes: Routes = [{
  path: '',
  component: PedidosComponent,
  children: [{
    path: 'encurso',
    component: PedidosHistorialComponent,
  },{
    path: 'finalizados',
    component: PedidosHoyComponent,
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
export class PedidosRoutingModule {

}

export const routedComponents = [
  PedidosComponent,
  PedidosHistorialComponent,
  PedidosHoyComponent,
];
