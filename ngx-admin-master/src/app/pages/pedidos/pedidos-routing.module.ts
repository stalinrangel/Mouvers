import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './pedidos.component';
import { PedidosCursoComponent } from './pedidos-curso/pedidos-curso.component';
import { PedidosFinalizadosComponent } from './pedidos-finalizados/pedidos-finalizados.component';

const routes: Routes = [{
  path: '',
  component: PedidosComponent,
  children: [{
    path: 'encurso',
    component: PedidosCursoComponent,
  },{
    path: 'finalizados',
    component: PedidosFinalizadosComponent,
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
  PedidosCursoComponent,
  PedidosFinalizadosComponent,
];
