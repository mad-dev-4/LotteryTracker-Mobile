import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController, IonSlides } from '@ionic/angular';
import { Group } from '../../../providers/group';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';
import { LTCache } from '../../../providers/lt-cache';


@Component({
  selector: 'app-draw-results',
  templateUrl: './draw-results.page.html',
  styleUrls: ['./draw-results.page.scss'],
})
export class DrawResultsPage implements OnInit {

	@ViewChild(IonSlides) slides: IonSlides;
	
	// array of all draws.  contains winningNumbers, multiple times
	draws: any = [];
	
	// default no value winning number definition
	blankWinningNum: any = { ID: 0 };

	// the parsed set of the latest data returned
	dataSet: any;
	
	// specifies if there is more data to fetch in the infinite scroll
	moreData:boolean = true;
	
	// current page number we are on
	pageNumber:number = 1;
	
	slideOpts = {
		initialSlide: 0,
		speed: 400
	};

	constructor(
		public groupProvider: Group, 
		public cache: LTCache,
		public logger: Logger,
		public pageHelper: PageHelper) {
				
		// get and show data
		this._getRecentWinnings();
	}

  ngOnInit() {
  }

  _getRecentWinnings(drawWinningNumbersId: number = 0) {
		this.logger.entry("DrawResultsPage","_getRecentWinnings");
		
		this.pageHelper.showLoader();
		
		this.groupProvider.getRecentWinnings(drawWinningNumbersId).subscribe((resp) => {
			this.pageHelper.hideLoader();
			
			this.dataSet = resp;

			for(let d of this.dataSet) {
				if (d.Regular) {
					let winningNumbers = [];
					winningNumbers.push(d);
					winningNumbers.push(this.blankWinningNum);
					this.draws.push(winningNumbers);
				}
			}
			for(let d of this.dataSet) {
				if (!d.Regular) {	
					let winningNumbers = [];
					winningNumbers.push(d);
					winningNumbers.push(this.blankWinningNum);
					this.draws.push(winningNumbers);
				}
			}
			
			this.logger.trace("DrawResultsPage","_getRecentWinnings","Number of games:" + this.dataSet.length);

		}, (err) => {
			this.pageHelper.processRequestError(err).subscribe((resp) => {
				this._getRecentWinnings();
			});
		});
	}

	async actionWillChange(drawIndex: number, slideObj: any) {
		this.logger.entry("DrawResultsPage","actionWillChange",drawIndex);

		let currentIndex = await slideObj.target.getActiveIndex();
		this.logger.trace("DrawResultsPage","actionWillChange","Current index is " + currentIndex);
		
		if (this.draws[drawIndex][currentIndex].ID == 0) {
			let winningNumberId = this.draws[drawIndex][currentIndex-1].ID;
			
			this.pageHelper.showLoader();
			
			this.groupProvider.getPrevNextWinnings(winningNumberId,true).subscribe((resp) => {
				this.pageHelper.hideLoader();
				
				// replace the data at this location
				let newNumbers = resp;
				if (newNumbers) {
					this.draws[drawIndex][currentIndex] = newNumbers;
					
					if (newNumbers.Draw && newNumbers.Draw.ResultsReceived) {
						// push a blank ion-slide so the user can keep scrolling
						this.draws[drawIndex].push(this.blankWinningNum);
					}
				}
			}, (err) => {
				this.pageHelper.processRequestError(err).subscribe((resp) => {
					this.actionWillChange(drawIndex, slideObj);
				});
			});	
			
		}		
	}
	
	
	ionViewDidLoad() {
		this.logger.trace("DrawResultsPage","ionViewDidLoad");
	}

}
