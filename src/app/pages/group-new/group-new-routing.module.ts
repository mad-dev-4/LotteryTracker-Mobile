import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupNewPage } from './group-new.page';

const routes: Routes = [
  {
    path: '',
    component: GroupNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupNewPageRoutingModule {}
