import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DrawResultsPage } from './draw-results.page';

const routes: Routes = [
  {
    path: '',
    component: DrawResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrawResultsPageRoutingModule {}
