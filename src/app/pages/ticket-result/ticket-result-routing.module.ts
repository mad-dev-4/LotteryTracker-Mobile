import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketResultPage } from './ticket-result.page';

const routes: Routes = [
  {
    path: '',
    component: TicketResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketResultPageRoutingModule {}
