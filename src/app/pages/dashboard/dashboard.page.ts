import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Logger } from '../../../providers/logger';
import { PageHelper } from '../../../providers/page-helper';
import { Group } from '../../../providers/group';
import { LTCache } from '../../../providers/lt-cache';

/**
 * DashboardTab
 *
 * This page is the users daily feed.  It displays things that have happened historically.  
 * i.e. ticket results and group messages.
 * Users can send a message to their group.
 *
 **/
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
	language: string = this.translateService.currentLang;

	// the list of cards shown on the screen
	cardList: Array<any> = [];

	// the parsed set of the latest data returned
	dataSet: any;

	// the New Comment text area of the page.  ngModel linkage
	newComment: any;

	// the number of total results in the system
	dataResultCount: number = 0;

	// current page number we are on
	pageNumber: number = 1;

	// list of groups
	groups: any;
	selectedGroup: any;

	// Translated error text strings
	private errorPostingMessage: string;
	private progressPostingMessage: string;
	private askToSelectGroup: string;

	constructor(
		public navCtrl: NavController,
		public translateService: TranslateService,
		public groupProvider: Group,
		public alertCtrl: AlertController,
		public cache: LTCache,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public logger: Logger,
		public pageHelper: PageHelper) {

		// load text strings
		this.translateService.get('DASHBOARD_SELECT_A_GROUP').subscribe((value: string) => {
			this.askToSelectGroup = value;
		});
		this.translateService.get('DASHBOARD_ERROR_POSTING_MESSAGE').subscribe((value: string) => {
			this.errorPostingMessage = value;
		});
		this.translateService.get('PROGRESS_POSTING').subscribe((value: string) => {
			this.progressPostingMessage = value;
		});

	} // end constructor

	/**
	 * Private method.  Call to load dashboard data
	 * @param refresher, a object refering to the screen being refereshed by pulling down the screen (action)
	 * @param pageNumber, the number of page from 1 to x.  used for lazy loading
	 * @param loaderRef, if a loader is specified, then the loading dialog will not be shown again.  just hidden on completion
	 **/
	async _refreshOrLoadData(refresher, pageNumber: number, loaderRef: any = null) {

		// Show data loading indicator
		let loader = await this.loadingCtrl.create({
			spinner: 'bubbles',
			message: this.pageHelper.loadingInProgress
		});

		if (!refresher && !loaderRef) {
			await loader.present();
		} else if (loaderRef) {
			loader = loaderRef;
		}

		// Load group data and change the UI model to reflect
		this.groupProvider.getCards(pageNumber).subscribe((resp) => {

			this.dataSet = resp;
			this.dataResultCount = this.dataSet.dataResultCount;
			this.logger.trace("DashboardPage", "_refreshOrLoadData", "Number of messages loaded:" + this.dataSet.length);

			if (pageNumber > 1 && this.cardList) {
				// pop records on array
				for (let d of this.dataSet.dataList) {
					this.cardList.push(d);
				}
			} else {
				this.cardList = this.dataSet.dataList;
			}

			if (refresher) {
				refresher.target.complete();
				//refresher.complete();
			} else {
				this.pageHelper.hideLoader(loader);
			}
		}, (err) => {
			if (refresher) {
				refresher.target.complete();
			} else {
				this.pageHelper.hideLoader(loader);
			}

			this.pageHelper.processRequestError(err).subscribe((resp) => {
				this._loadAllGroups();
			});
		});

	}


	/**
 * This method is called on every page view
 **/
	ionViewWillEnter() {
		this._loadAllGroups();
	}

	_loadAllGroups() {
		this.logger.entry("DashboardPage", "loadAllGroups");

		this.pageHelper.showLoader().then(loaderRef => {
			// Load group data and change the UI model to reflect
			this.groupProvider.getAllUserGroups().subscribe((resp) => {
				this.groups = resp;
				this.logger.trace("DashboardPage", "loadAllGroups", "ionViewWillEnter.groups:" + this.groups.length);

				// go off and load the data for the dashboard
				this._refreshOrLoadData(null, this.pageNumber, loaderRef);

			}, (err) => {
				this.pageHelper.processRequestError(err).subscribe((resp) => {
					this._loadAllGroups();
				});
			});
		});
	}

	/**
	 * Called from the UI when the user selects to refresh the data on the screen
	 **/
	doRefresh(refresher) {
		this.logger.entry("DashboardPage", "loadAllGroups", "Begin async refresh operation");
		this.pageNumber = 1;
		this._refreshOrLoadData(refresher, this.pageNumber);
	}

	/**
	 * Called from the UI when the user attempts to scroll down past the end of the results
	 **/
	doInfinite(infiniteScroll) {
		this.logger.entry("DashboardPage", "loadAllGroups", "Begin asyncinfinite scroll operation");

		if (this.cardList != null &&
			this.cardList.length < this.dataResultCount) {
			this.logger.trace("DashboardPage", "loadAllGroups",
				"Loading more...  List count: " + this.cardList.length + ", dataResultCount: " + this.dataResultCount);
			this._refreshOrLoadData(infiniteScroll, ++this.pageNumber);
		} else {
			infiniteScroll.complete();
		}
	}

	/**
	 * Posts a new comment to the selected wall.
	 **/
	async actionPostComment() {
		this.logger.entry("DashboardPage", "loadAllGroups", "actionPostComment: " + this.selectedGroup);

		if (this.selectedGroup && this.selectedGroup > 0) {
			if (this.newComment && this.newComment.length > 0) {

				this.pageHelper.showLoader();

				// Post a message to the wall
				this.groupProvider.postNewMessage(this.selectedGroup, this.newComment, false).subscribe((resp) => {
					this.pageHelper.hideLoader();
					this.logger.trace("DashboardPage", "actionPostComment", "postNewMessage: Successful");
					this.newComment = "";

					// add the new card
					this.cardList.unshift(resp);
				}, (err) => {
					this.logger.trace("DashboardPage", "actionPostComment", "postNewMessage: Error");
					this.pageHelper.processRequestError(err, this.errorPostingMessage).subscribe((resp) => {
						this.logger.trace("DashboardPage", "actionPostComment", "processRequestError");
						//this.actionPostComment();
					});
				});
			}
		} else {
			const alert = await this.alertCtrl.create({
				header: this.askToSelectGroup,
				buttons: [this.pageHelper.buttonOk]
			});
			alert.present();
		}
	}

	ngOnInit() {
	}

}
