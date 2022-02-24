import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../providers/user';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';

@Component({
	selector: 'app-account',
	templateUrl: './account.page.html',
	styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

	@ViewChild('input') myInput;

	isReadyToSave: boolean;

	updateProfileForm: FormGroup;

	// user data object
	user: any;

	constructor(
		public navCtrl: NavController,
		public translateService: TranslateService,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public userProvider: User,
		public logger: Logger,
		public formBuilder: FormBuilder,
		public router: Router,
		public modalCtrl: ModalController,
		public pageHelper: PageHelper) {

		this.user = { "FirstName": "", "LastName": "", "ProvinceCode": "", "SendEmailUpdates": false, "timeBirthday": null };

		// Add form validators
		this.updateProfileForm = formBuilder.group({
			FirstName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			LastName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			ProvinceCode: ['', null],
			SendEmailUpdates: ['', null],
			BirthdayDate: ['', null]
		});

		this._loadProfile();

	}// end constructor

	ngOnInit() {
	}


	/**
	 * This method loads the users profile
	 **/
	_loadProfile() {
		this.logger.entry("AccountPage", "_loadProfile");
		this.pageHelper.showLoader();

		// Load the users profile and update the UI
		this.userProvider.getProfile().subscribe((resp) => {
			this.user = resp;

			// build valid ISO 8601 datetime string
			this.user.timeBirthday = this.user.YearOfBirth + "-" + this.user.MonthOfBirth + "-" + this.user.DayOfBirth;

			// Watch the form for changes, and
			this.updateProfileForm.valueChanges.subscribe((v) => {
				this.isReadyToSave = this.updateProfileForm.valid;
			});

			this.pageHelper.hideLoader();
		}, (err) => {
			this.pageHelper.processRequestError(err).subscribe((resp) => {
				this._loadProfile();
			});
		});
	}

	/**
	 * This method saves the users profile
	 **/
	saveProfileForm(value: string): void {
		this.logger.entry("AccountPage", "saveProfileForm");

		if (!this.updateProfileForm.valid) { return; }

		this.pageHelper.showSaver();

		// break ISO datetime string into 3 components to submit
		if (this.user.timeBirthday != '') {
			var values = this.user.timeBirthday.split("-");
			if (values.length >= 3) {
				this.user.YearOfBirth = values[0];
				this.user.MonthOfBirth = values[1];
				this.user.DayOfBirth = values[2];
			}
		}

		// Load group data and change the UI model to reflect
		this.userProvider.updateProfile(this.user).subscribe((resp) => {

			this.pageHelper.hideLoader();
			this.logger.trace("AccountPage", "saveProfileForm", "Created successfully");

			// pop the view only after successful save
			this.navCtrl.back();
			//this.viewCtrl.dismiss();
			//this.router.navigate(['']);
		}, (err) => {
			this.pageHelper.processRequestError(err, this.pageHelper.errorSavingChange).subscribe((resp) => {
				this.saveProfileForm(value);
			});
		});

	}

}
