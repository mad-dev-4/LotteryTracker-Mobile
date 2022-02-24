import { Component, OnInit } from '@angular/core';
import { User } from '../../../providers/user';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {


	// alert data objects
	slider649 : number = 0;
	sliderMax : number = 0;
	
	// last values that were saved
	slider649LastNumSaves : number = 0;
	sliderMaxLastNumSaves : number = 0;

	// is saving in progress?
	saving : boolean = false;
0
	constructor(
		public userProvider: User, 
		public logger: Logger,
		public pageHelper: PageHelper) {

		this._getMemberAlerts();
	}// end constructor

  ngOnInit() {
  }

  _getMemberAlerts() {
		this.logger.entry("NotificationsPage","_getMemberAlerts");
		this.pageHelper.showLoader();
		
		this.userProvider.getAllMembersAlerts().subscribe((resp) => {
			let alerts = resp;
			this.logger.trace("NotificationsPage","_getMemberAlerts","alerts: " + alerts.length);
			
			this.pageHelper.hideLoader();
			
			for(let x of alerts) {
				if (x.Type=="LottoPrizeAlert1") {
					this.slider649 = x.AlertValue;
					this.slider649LastNumSaves = this.slider649;
				}else if (x.Type=="LottoPrizeAlert2") {
					this.sliderMax = x.AlertValue;
					this.sliderMaxLastNumSaves = this.sliderMax;
				}
			}
			
		}, (err) => {
			this.logger.trace("NotificationsPage","_getMemberAlerts","Error");
			this.pageHelper.processRequestError(err).subscribe((resp) => {
				this._getMemberAlerts();
			});
		});
	}
	

	updateMax() {
		this.logger.entry("NotificationsPage","updateMax");
		
		let x = this.sliderMax;
		setTimeout(() => {
			if (x == this.sliderMax && !this.saving && this.sliderMaxLastNumSaves != this.sliderMax) {
				this.saving = true;
				this.sliderMaxLastNumSaves = this.sliderMax;
			
				// save since it hasn't changed in 2 seconds
				this.actionSaveValues("LottoPrizeAlert2", this.sliderMax);
			}
		}, 500);
	}
	
	update649() {
		this.logger.entry("NotificationsPage","update649");
		
		let x = this.slider649;
		setTimeout(() => {
			if (x == this.slider649 && !this.saving && this.slider649LastNumSaves != this.slider649) {
				this.saving = true;
				this.slider649LastNumSaves = this.slider649;
			
				// save since it hasn't changed in 2 seconds
				this.actionSaveValues("LottoPrizeAlert1", this.slider649);
			}
		}, 1000);
	}
	
	actionSaveValues(alertType: string, alertValue: number) {
		this.logger.entry("NotificationsPage","actionSaveValues", "alertValue: " + alertValue);
		this.pageHelper.showSaver();
		
		// load the PUT request body
		let alertPut = {"Type" : alertType, "AlertValue" : alertValue};
		
		// Save the alert value
		this.userProvider.saveAlert(alertPut).subscribe((resp) => {
			this.saving = false;
			this.logger.trace("NotificationsPage","actionSaveValues", "Update Successful");
			this.pageHelper.hideLoader();
		}, (err) => {
			this.saving = false;
			this.logger.trace("NotificationsPage","actionSaveValues","Error");
			this.pageHelper.processRequestError(err, this.pageHelper.errorSavingChange).subscribe((resp) => {
				// don't keep trying to save
				//this.actionSaveValues(alertType, alertValue);
			});
		});
	}

}
