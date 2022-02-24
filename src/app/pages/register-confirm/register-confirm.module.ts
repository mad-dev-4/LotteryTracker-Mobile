import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterConfirmPageRoutingModule } from './register-confirm-routing.module';

import { RegisterConfirmPage } from './register-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterConfirmPageRoutingModule
  ],
  declarations: [RegisterConfirmPage]
})
export class RegisterConfirmPageModule {}
