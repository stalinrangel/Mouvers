import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasComponent } from './categorias.component';
import { CategoriasVerComponent } from './categorias-ver/categorias-ver.component';
import { CategoriasAgregarComponent } from './categorias-agregar/categorias-agregar.component';

const routes: Routes = [{
  path: '',
  component: CategoriasComponent,
  children: [{
    path: 'ver',
    component: CategoriasVerComponent,
  },{
    path: 'agregar',
    component: CategoriasAgregarComponent,
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
export class CategoriasRoutingModule {

}

export const routedComponents = [
  CategoriasComponent,
  CategoriasVerComponent,
  CategoriasAgregarComponent,
];
