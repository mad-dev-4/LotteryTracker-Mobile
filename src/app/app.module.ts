import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

// ionic libs
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy, AlertController, ModalController, LoadingController, ToastController } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';


/*
import { MapToIterablePipe } from './pipes/maptoiterable.pipe'; // import pipe 
import { OrderByPipe } from './pipes/orderby.pipe'; // import pipe 
import { FormatLottoBoardPipe } from './pipes/formatlottoboard.pipe'; // import pipe
import { FormatCurrencyPipe } from './pipes/formatcurrency.pipe'; // import pipe
*/
import { EventsService } from '../events/events-service';


// Import all Pages
//import { LoginPage } from './login/login.page';

/*
import { TicketPage } from '../pages/ticket/ticket';
import { TicketListPage } from '../pages/ticket-list/ticket-list';
import { TicketNewPage } from '../pages/ticket-new/ticket-new';
import { MemberPage } from '../pages/member/member';
import { GroupPage } from '../pages/group/group';
import { MenuPage } from '../pages/menu/menu';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { TabsPage } from '../pages/tabs/tabs';
import { AccountPage } from '../pages/account/account';
import { GroupEditPage } from '../pages/group-edit/group-edit';
import { GroupNewPage } from '../pages/group-new/group-new';
import { RegisterPage } from '../pages/register/register';
import { NotificationsPage } from '../pages/notifications/notifications';
import { TicketResultPage } from '../pages/ticket-result/ticket-result';
import { SelectGroupPage } from '../pages/select-group/select-group';
import { SelectLottoPage } from '../pages/select-lotto/select-lotto';
import { DrawResultsPage } from '../pages/draw-results/draw-results';
import { TermsPage } from '../pages/terms/terms';
import { AboutPage } from '../pages/about/about';
import { StartPage } from '../pages/start/start';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { RegisterConfirmPage } from '../pages/register-confirm/register-confirm';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { TicketResultCard } from '../shared/ticket-result-card';
import { TicketCard } from '../shared/ticket-card';
import { LoginPage } from '../pages/login/login';
*/



// import custom providers
import { Group } from '../providers/group';
import { User } from '../providers/user';
import { PageHelper } from '../providers/page-helper';

import { Logger } from '../providers/logger';
import { LTCache } from '../providers/lt-cache';
import { InterceptedHttp } from "./http.interceptor";


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// The LTCache stores name/value pairs.  This function loads dome defaults 
export function ltCacheDefaults(storage: Storage) {
  return new LTCache(storage, {
    language: 'en'
  });
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),

  ],
  providers: [
    Logger,
    User,
    Group,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LTCache, useFactory: ltCacheDefaults, deps: [Storage, Logger] },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: InterceptedHttp },
    {
      provide: PageHelper,
      useFactory: (translateService: TranslateService, alertCtrl: AlertController, modalCtrl: ModalController, loadingCtrl: LoadingController, logger: Logger, events: EventsService) => {
        return new PageHelper(translateService, alertCtrl, modalCtrl, loadingCtrl, logger, events);
      },
      deps: [TranslateService, AlertController, ModalController, LoadingController, Logger, EventsService]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
