import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatBoxComponent } from './chat-box.component';

const routes: Routes = [{
  path: '',
  component: ChatBoxComponent,
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ChatBoxRoutingModule {

}

export const routedComponents = [
  ChatBoxComponent,
];
