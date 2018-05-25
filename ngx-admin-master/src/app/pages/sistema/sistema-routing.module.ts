import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SistemaComponent } from './sistema.component';

const routes: Routes = [{
  path: '',
  component: SistemaComponent,
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SistemaRoutingModule {

}

export const routedComponents = [
  SistemaComponent,
];
