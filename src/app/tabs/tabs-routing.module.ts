import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
//import { LoginPage } from '../login/login.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard-tab',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'group-tab',
        loadChildren: () => import('../pages/group/group.module').then( m => m.GroupPageModule)
      },
      {
        path: 'menu-tab',
        loadChildren: () => import('../pages/menu-tab/menu-tab.module').then( m => m.MenuTabPageModule)
      },
      {
        path: 'jackpot-tab',
        loadChildren: () => import('../pages/jackpot/jackpot.module').then( m => m.JackpotPageModule)
      },
      {
        path: 'draw-results-tab',
        loadChildren: () => import('../pages/draw-results/draw-results.module').then( m => m.DrawResultsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/group-tab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/group-tab',
    pathMatch: 'full'
  },
  /*
  {
    path: '/login',
    component: LoginPage,
    pathMatch: 'full'
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
