import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadproductoPage } from './uploadproducto.page';

const routes: Routes = [
  {
    path: '',
    component: UploadproductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadproductoPageRoutingModule {}
