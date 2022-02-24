import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { Group } from '../../../providers/group';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';

@Component({
	selector: 'app-group-new',
	templateUrl: './group-new.page.html',
	styleUrls: ['./group-new.page.scss'],
})
export class GroupNewPage implements OnInit {

	@ViewChild('input') myInput;

	groupCreatedSuccessfullyText = "";

	isReadyToSave: boolean;

	createGroupForm: FormGroup;
	name: AbstractControl;

	// group data object
	group: any;

	constructor(
		public groupProvider: Group,
		public formBuilder: FormBuilder,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		public logger: Logger,
		public pageHelper: PageHelper,
		public router: Router,
		public toastController: ToastController,
		public translateService: TranslateService) {

		this.createGroupForm = formBuilder.group({
			Name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
		});

		this.name = this.createGroupForm.controls["Name"];

		// Watch the form for changes, and
		this.createGroupForm.valueChanges.subscribe((v) => {
			this.isReadyToSave = this.createGroupForm.valid;
		});

		this.translateService.get("GROUP_NEW_CREATED").subscribe((value) => {
			this.groupCreatedSuccessfullyText = value;
		});

	} // end constructor

	ngOnInit() {
	}

	/**
* The user is done and wants to create the group
*/
	saveGroupForm(value: string): void {
		this.logger.entry("GroupNewPage", "saveGroupForm", "Value: " + value);

		if (!this.createGroupForm.valid) { return; }
		this.logger.trace("GroupNewPage", "saveGroupForm", "Name: " + this.createGroupForm.controls['Name'].value);

		this.pageHelper.showSaver();

		// Load group data and change the UI model to reflect
		this.groupProvider.createGroup(this.createGroupForm.controls['Name'].value).subscribe((resp) => {
			this.group = resp;

			this.pageHelper.hideLoader();
			this.logger.trace("GroupNewPage", "saveGroupForm", "Created successfully");
			this.showToast(this.groupCreatedSuccessfullyText);

			// go back
			this.navCtrl.pop();
		}, (err) => {
			this.pageHelper.processRequestError(err, this.pageHelper.errorSavingChange).subscribe((resp) => {
				this.saveGroupForm(value);
			});
		});
	}


	/**
	 * When the screen is shown, the focus is set on the input group name.
	 **/
	ionViewDidEnter() {
		this.logger.entry("GroupNewPage", "ionViewDidEnter");
		this.myInput.setFocus();
	}

	async showToast(messageToShow) {
		const toast = await this.toastController.create({
			message: messageToShow,
			duration: 2000,
			position: 'top',
			buttons: [
				{
					text: 'X',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		toast.present();
	}

}
