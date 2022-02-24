import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Logger } from '../../../providers/logger';
import { PageHelper } from '../../../providers/page-helper';
import { Group } from '../../../providers/group';
import { LTCache } from '../../../providers/lt-cache';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-result',
  templateUrl: './ticket-result.page.html',
  styleUrls: ['./ticket-result.page.scss'],
})
export class TicketResultPage implements OnInit {

  // The ticketId being acted on
  ticketId: string;

  // list of ticket results, data object
  ticketWithResult: any = { "TicketDrawResult": null };

  // the number of total results in the system
  dataResultCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService,
    public groupProvider: Group,
    public alertCtrl: AlertController,
    public cache: LTCache,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public logger: Logger,
    public route: ActivatedRoute,
    public pageHelper: PageHelper) {
  }

  ngOnInit() {
    this.logger.entry("TicketResultPage", "ngOnInit");
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.ticketId = params['id'];
        this._getTicketResults();
      }
    });
  }

  _getTicketResults() {
    this.pageHelper.showLoader();

    this.groupProvider.getTicket(this.ticketId, true).subscribe((resp) => {
      this.pageHelper.hideLoader();
      this.ticketWithResult = resp;

    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this._getTicketResults();
      });
    });
  }


}
