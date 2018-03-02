import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './productos.component';
import { ProductosVerComponent } from './productos-ver/productos-ver.component';
import { ProductosAgregarComponent } from './productos-agregar/productos-agregar.component';

const routes: Routes = [{
  path: '',
  component: ProductosComponent,
  children: [{
    path: 'ver',
    component: ProductosVerComponent,
  },{
    path: 'agregar',
    component: ProductosAgregarComponent,
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
export class ProductosRoutingModule {

}

export const routedComponents = [
  ProductosComponent,
  ProductosVerComponent,
  ProductosAgregarComponent,
];
