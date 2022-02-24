import { Component, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../providers/user';
import { LTCache } from '../../../providers/lt-cache';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { LoginserviceService } from '../../services/loginservice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  @ViewChild('emailInput') emailInputObj;

  // Variable to specify if the form meets validation criteria.  
  // Submit button becomes active
  isReadyToSave: boolean;

  // Variable specifying if the request was submitted successfully. 
  // If so, we show a message to the user
  submittedSuccessfully: boolean;

  // The form object
  userForm: FormGroup;

  // Data object
  user: any;

  constructor(
    public router: Router,
    public logger: Logger,
    public pageHelper: PageHelper,
    public formBuilder: FormBuilder,
    public userProvider: User) {

    // set the object to something, so on initial display, there is something to reference
    this.user = { "EmailAddress": "", "Channel": "Mobile" };

    this.userForm = formBuilder.group({
      EmailAddress: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });

    // Watch the form for changes, and
    this.userForm.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.userForm.valid;
    });
  }

  /**
   * When the page enters, set focus on the email address field
   **/
  ionViewDidEnter() {
    this.logger.entry("ForgotPasswordPage", "ionViewDidEnter");

    // wait a split second before focusing
    setTimeout(() => {
      //this.emailInputObj.setFocus();
    }, 150);
  }

  /** 
 * Method to submit the user email address and start the forgot password processRequestError
 **/
  sendPasswordResetForm() {
    this.logger.entry("ForgotPasswordPage", "sendPasswordResetForm");
    if (!this.userForm.valid) { return; }

    this.pageHelper.showSaver();

    // Submit action
    this.userProvider.submitForgotPasswordRequest(this.user).subscribe((resp) => {
      this.pageHelper.hideLoader();
      this.logger.trace("ForgotPasswordPage", "sendPasswordResetForm", "Successful");

      // Change display
      this.submittedSuccessfully = true;

    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
      });
    });
  }

  /**
   * Button on the screen that will take the user to the previous page
   **/
  //actionGoBack() {
    //this.router.navigate(['login']);
 // }

  ngOnInit() {
  }

}
