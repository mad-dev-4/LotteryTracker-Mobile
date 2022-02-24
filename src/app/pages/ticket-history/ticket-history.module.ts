import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TicketHistoryPageRoutingModule } from './ticket-history-routing.module';

import { TicketHistoryPage } from './ticket-history.page';

import { TicketResultCard } from '../shared/ticket-result-card/ticket-result-card';
import { TicketCard } from '../shared/ticket-card/ticket-card';
import { PipesModule } from '../../pipes/pipes.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketHistoryPageRoutingModule,
    PipesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    TicketHistoryPage,
    TicketResultCard,
    TicketCard
  ]
})
export class TicketHistoryPageModule { }
