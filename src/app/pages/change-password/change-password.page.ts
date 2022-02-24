import { Component, OnInit, ViewChild } from '@angular/core';

import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../providers/user';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  @ViewChild('input') myInput;

  isReadyToSave: boolean;

  showPassword: boolean = false;

  updateForm: FormGroup;

  // user data object
  user: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userProvider: User,
    public logger: Logger,
    public formBuilder: FormBuilder,
    public router: Router,
    public modalCtrl: ModalController,
    public pageHelper: PageHelper) {

    this.user = { "Password": "", "NewPassword": "", "ConfirmPassword": "" }

    // Add form validators
    this.updateForm = formBuilder.group({
      Password: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      NewPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      ConfirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    // Watch the form for changes, and
    this.updateForm.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.updateForm.valid;
    });
  }

  ngOnInit() {
  }

/**
 * This method changes the users password
 **/
  saveForm(value: string): void {
    this.logger.entry("ChangePasswordPage", "saveForm");

    if (!this.updateForm.valid) { return; }

    this.pageHelper.showSaver();

    // Load group data and change the UI model to reflect
    this.userProvider.changePassword(this.user).subscribe((resp) => {

      this.pageHelper.hideLoader();
      this.logger.trace("ChangePasswordPage", "saveForm", "Changed successfully");

      // pop the view only after successful save
      this.navCtrl.back();
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        // do nothing
      });
    });

  }

  /** 
   * This method is called to toggle hiding and showing passwords on this screen
   **/
  showHidePassword(event) {
    this.logger.entry("ChangePasswordPage", "showHidePassword");
    this.showPassword = !this.showPassword;
  }

}
