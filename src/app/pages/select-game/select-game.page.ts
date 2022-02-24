import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { Logger } from '../../../providers/logger';
import { PageHelper } from '../../../providers/page-helper';
import { Group } from '../../../providers/group';
import { User } from '../../../providers/user';
import { LTCache } from '../../../providers/lt-cache';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.page.html',
  styleUrls: ['./select-game.page.scss'],
})
export class SelectGamePage implements OnInit {

  // games data object
  games: any = [];

  // when games are loaded, this value to symbolizes that no games exist
  noGames: boolean = false;

  // The groupId being acted on
  groupId: string;

  // The name corresponding to the groupId
  groupName: string;

  // Stores the last province the user selected in memory
  lastProvince: string;

  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService,
    public groupProvider: Group,
    public userProvider: User,
    public alertCtrl: AlertController,
    public cache: LTCache,
    public loadingCtrl: LoadingController,
    public logger: Logger,
    public route: ActivatedRoute,
    public pageHelper: PageHelper,
    public router: Router) {

    this.lastProvince = cache.getValue(cache.KEY_DEFAULT_PROVINCE);
    this.lastProvince = this.lastProvince == null ? "ON" : this.lastProvince;
  }

  ngOnInit() {
    this.logger.entry("SelectGamePage", "ngOnInit");
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.groupId = params['id'];
        this.logger.trace("SelectGamePage", "constructor", "constructor.groupId:" + this.groupId);
      }
    });
    this.route.queryParams.subscribe(params => {
      this.groupName = params['groupName'];
      this.logger.trace("SelectGamePage", "constructor", "constructor.groupName:" + this.groupName);
    });
  }

  /**
   * This method is called on every page view
   **/
  ionViewWillEnter() {
    this.logger.entry("SelectGamePage", "ionViewWillEnter");
    this._loadGames();
  }

  _loadGames() {
    this.logger.entry("SelectGamePage", "_loadGames");
    this.pageHelper.showLoader();

    // Load group data and change the UI model to reflect
    this.groupProvider.getCreatableGames(this.lastProvince).subscribe((resp) => {
      this.games = resp;
      if (this.games.lenghth == 0) {
        this.noGames = true;
      }
      this.pageHelper.hideLoader();
      this.logger.trace("SelectGamePage", "_loadGames", "Number of games:" + this.games.length);
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this._loadGames();
      });
    });
  }

  provinceSelectionChanged(event?: UIEvent | undefined) {
    this.logger.trace("SelectGamePage", "provinceSelectionChanged", "Province:" + this.lastProvince);
    if (this.lastProvince != null && this.lastProvince != '') {
      this.cache.setValue(this.cache.KEY_DEFAULT_PROVINCE, this.lastProvince);
      this._loadGames();
    }
  }

  /**
   * UI Action when a listed games is selected.  
   **/
  actionSelectGame(gameId: number, gameName: string) {
    this.logger.trace("SelectGamePage", "actionSelectGame", "gameId:" + gameId + ", gameName: " + gameName);
    this.router.navigate(['ticket-new', this.groupId], {
      queryParams: {
        gameId: gameId,
        gameName: gameName,
        groupName: this.groupName
      }
    });
  }

}
