import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Logger } from '../../../providers/logger';
import { PageHelper } from '../../../providers/page-helper';
import { Group } from '../../../providers/group';
import { LTCache } from '../../../providers/lt-cache';
import { ActivatedRoute } from '@angular/router';

/**
 * TicketListPage
 *
 * This page shows recent tickets for a specific group.  
 *
 **/
@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.scss'],
})
export class TicketListPage implements OnInit {

  // list of tickets, data object
  ticketsAll: Array<any> = [];

  // the parsed set of the latest data returned
  dataSet: any;

  // the number of total results in the system
  dataResultCount: number = 0;

  // current page number we are on
  pageNumber: number = 1;

  // maximum pages allowed to be stored in buffer 
  maxPageNumber: number = 7;

  // current group number
  groupId = "";

  // specifies if no tickets are found.  default is true
  foundGroupTickets = true;

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
    this.logger.entry("TicketListPage", "ngOnInit");
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.groupId = params['id'];
        this._getTicketsInGroup(this.groupId, this.pageNumber);
      }
    });
  }

  _getTicketsInGroup(groupId: string, pageNumber: number, refresher = null) {
    this.logger.entry("TicketListPage", "_getTicketsInGroup", groupId);
    this.pageHelper.showLoader();

    this.groupProvider.getAllTicketsInGroup(groupId, this.pageNumber, 3).subscribe((resp) => {
      this.pageHelper.hideLoader();

      this.dataSet = resp;
      this.dataResultCount = this.dataSet.dataResultCount;
      this.logger.trace("TicketListPage", "_getTicketsInGroup", "tickets:" + this.dataSet.length);

      if (this.pageNumber <= 1) {
        this.ticketsAll = [];
        this.foundGroupTickets = this.dataResultCount > 0;
      }

      // pop records on array
      for (let d of this.dataSet.dataList) {
        if (d.HasFutureDraws) {
          d.HasFutureDraws = true;
        }
        this.ticketsAll.push(d);
      }

    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this._getTicketsInGroup(groupId, this.pageNumber);
      });
    }, () => {
      if (refresher) {
				refresher.target.complete();
      }
    });
  }

 /**
  * Called from the UI when the user attempts to scroll down past the end of the results
  **/
  doInfinite(infiniteScroll) {
    this.logger.entry("TicketListPage", "doInfinite", "Begin asyncinfinite scroll operation");

    if (this.dataSet != null &&
      this.pageNumber < this.maxPageNumber && 
      this.dataSet.dataList.length < this.dataResultCount) {
      this.logger.trace("TicketListPage", "loadAllGroups",
        "Loading more...  List count: " + this.dataSet.dataList.length + ", dataResultCount: "
        + this.dataResultCount);
      this._getTicketsInGroup(this.groupId, ++this.pageNumber, infiniteScroll);
    } else {
      infiniteScroll.target.complete();
    }
  }

}
