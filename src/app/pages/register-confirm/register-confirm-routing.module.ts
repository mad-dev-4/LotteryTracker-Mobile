import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterConfirmPage } from './register-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterConfirmPageRoutingModule {}
