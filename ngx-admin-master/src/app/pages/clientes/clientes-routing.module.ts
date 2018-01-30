import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { ClientesVerComponent } from './clientes-ver/clientes-ver.component';

const routes: Routes = [{
  path: '',
  component: ClientesComponent,
  children: [{
    path: 'ver',
    component: ClientesVerComponent,
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
export class ClientesRoutingModule {

}

export const routedComponents = [
  ClientesComponent,
  ClientesVerComponent,
];
