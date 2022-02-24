import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketNewPage } from './ticket-new.page';

const routes: Routes = [
  {
    path: '',
    component: TicketNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketNewPageRoutingModule {}
