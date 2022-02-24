import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectGamePage } from './select-game.page';

const routes: Routes = [
  {
    path: '',
    component: SelectGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectGamePageRoutingModule {}
