import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'register-confirm',
    loadChildren: () => import('./pages/register-confirm/register-confirm.module').then( m => m.RegisterConfirmPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'group-new',
    loadChildren: () => import('./pages/group-new/group-new.module').then( m => m.GroupNewPageModule)
  },
  {
    path: 'group-edit/:id',
    loadChildren: () => import('./pages/group-edit/group-edit.module').then( m => m.GroupEditPageModule)
  },
  {
    path: 'member/:id',
    loadChildren: () => import('./pages/member/member.module').then( m => m.MemberPageModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./pages/ticket/ticket.module').then( m => m.TicketPageModule)
  },
  {
    path: 'ticket-list/:id',
    loadChildren: () => import('./pages/ticket-list/ticket-list.module').then( m => m.TicketListPageModule)
  },
  {
    path: 'ticket-new/:id',
    loadChildren: () => import('./pages/ticket-new/ticket-new.module').then( m => m.TicketNewPageModule)
  },
  {
    path: 'ticket-result/:id',
    loadChildren: () => import('./pages/ticket-result/ticket-result.module').then( m => m.TicketResultPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'group',
    loadChildren: () => import('./pages/group/group.module').then( m => m.GroupPageModule)
  },
  {
    path: 'jackpot',
    loadChildren: () => import('./pages/jackpot/jackpot.module').then( m => m.JackpotPageModule)
  },
  {
    path: 'draw-results',
    loadChildren: () => import('./pages/draw-results/draw-results.module').then( m => m.DrawResultsPageModule)
  },
  {
    path: 'group-manage',
    loadChildren: () => import('./pages/group-manage/group-manage.module').then( m => m.GroupManagePageModule)
  },
  {
    path: 'ticket-history/:id',
    loadChildren: () => import('./pages/ticket-history/ticket-history.module').then( m => m.TicketHistoryPageModule)
  },
  {
    path: 'select-game/:id',
    loadChildren: () => import('./pages/select-game/select-game.module').then( m => m.SelectGamePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
