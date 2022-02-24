import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Logger } from '../../../providers/logger';
import { PageHelper } from '../../../providers/page-helper';
import { Group } from '../../../providers/group';
import { LTCache } from '../../../providers/lt-cache';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.page.html',
  styleUrls: ['./ticket-new.page.scss'],
})
export class TicketNewPage implements OnInit {

  // The gameId being acted on
  gameId: string;

  // The name corresponding to the gameId
  gameName: string;

  // The groupId being acted on
  groupId: string;

  // The name corresponding to the groupId
  groupName: string;

  // ngModel for the number of draws selection menu
  selectNumOfDraws: number = 1;

  // an array of numbers.  Number of lottery draws selection
  numbers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

  // count the number of boards possible
  numberOfBoards: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // game details json document 
  game;

  public event = {
    month: '1990-02-19',
    timeEnds: '1990-02-20'
  }

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


    // get/set the current date
    //this.currentTime = Observable.interval(1000).map(x => new Date()).share();
  }

  ngOnInit() {
    this.logger.entry("TicketNewPage", "ngOnInit");
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.groupId = params['id'];

        console.log("ngOnInit.groupId:", this.groupId);
      }
    });
    this.route.queryParams.subscribe(params => {
      this.gameId = params['gameId'];
      this.gameName = params['gameName'];
      this.groupName = params['groupName'];

      this.logger.entry("TicketNewPage", "ngOnInit.groupName:" + this.groupName);
      this.logger.entry("TicketNewPage", "ngOnInit.gameId:" + this.gameId);
      this.logger.entry("TicketNewPage", "ngOnInit.gameName:" + this.gameName);
    });
  }

  /**
   * This method is called on every page view
   **/
     ionViewWillEnter() {
      this.logger.entry("TicketNewPage", "ionViewWillEnter");
      this._loadGame();
    }

  _loadGame() {
    this.logger.entry("TicketNewPage", "_loadGame");
    this.pageHelper.showLoader();

    // Load group data and change the UI model to reflect
    this.groupProvider.getGame(this.gameId).subscribe((resp) => {
      this.game = resp;
      this.pageHelper.hideLoader();
      //this.logger.trace("TicketNewPage", "_loadGame", "Number of games:" + this.games.length);
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this._loadGame();
      });
    });
  }

}
