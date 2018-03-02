import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubcategoriasComponent } from './subcategorias.component';
import { SubcategoriasVerComponent } from './subcategorias-ver/subcategorias-ver.component';
import { SubcategoriasAgregarComponent } from './subcategorias-agregar/subcategorias-agregar.component';

const routes: Routes = [{
  path: '',
  component: SubcategoriasComponent,
  children: [{
    path: 'ver',
    component: SubcategoriasVerComponent,
  },{
    path: 'agregar',
    component: SubcategoriasAgregarComponent,
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
export class SubcategoriasRoutingModule {

}

export const routedComponents = [
  SubcategoriasComponent,
  SubcategoriasVerComponent,
  SubcategoriasAgregarComponent,
];
