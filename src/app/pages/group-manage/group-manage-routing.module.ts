import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupManagePage } from './group-manage.page';

const routes: Routes = [
  {
    path: '',
    component: GroupManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupManagePageRoutingModule {}
