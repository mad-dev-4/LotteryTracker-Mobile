import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketHistoryPage } from './ticket-history.page';

const routes: Routes = [
  {
    path: '',
    component: TicketHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketHistoryPageRoutingModule {}
