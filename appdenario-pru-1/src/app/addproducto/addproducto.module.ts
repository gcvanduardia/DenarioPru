import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddproductoPageRoutingModule } from './addproducto-routing.module';

import { AddproductoPage } from './addproducto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddproductoPageRoutingModule
  ],
  declarations: [AddproductoPage]
})
export class AddproductoPageModule {}
