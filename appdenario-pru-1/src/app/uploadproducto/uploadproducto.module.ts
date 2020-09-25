import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadproductoPageRoutingModule } from './uploadproducto-routing.module';

import { UploadproductoPage } from './uploadproducto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadproductoPageRoutingModule
  ],
  declarations: [UploadproductoPage]
})
export class UploadproductoPageModule {}
