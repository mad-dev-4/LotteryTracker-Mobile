import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { Group } from '../../../providers/group';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router, ActivatedRoute } from '@angular/router';
import { LTCache } from '../../../providers/lt-cache';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.page.html',
  styleUrls: ['./group-edit.page.scss'],
})
export class GroupEditPage implements OnInit {

  @ViewChild('input') myInput;

  isReadyToSave: boolean;
  canDelete: boolean;

  form: FormGroup;
  formDelete: FormGroup;

  // group data object
  group: any;
  groupId: string;

  // Current signed in users email address
  usersEmail: string;

  constructor(
    public groupProvider: Group,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public logger: Logger,
    public pageHelper: PageHelper,
    public router: Router,
    public route: ActivatedRoute,
    public cache: LTCache,
    public toastController: ToastController,
    public translateService: TranslateService) {

    //this.groupId = navParams.get('groupId');

    this.usersEmail = cache.getValue("Username");
    this.usersEmail = this.usersEmail ? this.usersEmail.toLowerCase() : null;

    // set the object to something, so on initial display, there is something to reference
    this.group = { "Name": "" };

    this.form = formBuilder.group({
      Name: ['', Validators.required]
    });

    this.formDelete = formBuilder.group({
    });

  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.groupId = params['id'];
      }
    });
  }

  ionViewDidEnter() {
    this.logger.entry("GroupEditPage", "ionViewDidEnter");
    this._getGroup();
  }

  _getGroup() {
    this.pageHelper.showLoader();

    // Load group data and change the UI model to reflect
    this.groupProvider.getGroup(this.groupId).subscribe((resp) => {
      this.group = resp;

      // Watch the form for changes, and
      this.form.valueChanges.subscribe((v) => {
        this.isReadyToSave = this.form.valid;
      });

      if (this.group.GroupCaptains) {

        for (let cptn of this.group.GroupCaptains) {
          if (cptn.EmailAddress.toLowerCase() == this.usersEmail) {
            this.canDelete = true;
            break;
          }
        }

      }

      this.myInput.setFocus();
      this.pageHelper.hideLoader();
      this.logger.trace("GroupEditPage", "_loadGames", "Number of groups:" + this.group.length);
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this._getGroup();
      });
    });

  }


  /**
  * The user is done and wants to save the change
  */
  saveGroupForm() {
    if (!this.form.valid) { return; }

    this.pageHelper.showSaver();

    // load the PUT request body
    let groupPut = { "Id": this.group.GroupId, "Name": this.group.Name };

    // Load group data and change the UI model to reflect
    this.groupProvider.saveGroup(groupPut).subscribe((resp) => {
      this.group = resp;

      this.pageHelper.hideLoader();
      this.logger.trace("GroupEditPage", "saveGroupForm", "Successful");

      // pop the view only after successful save
      this.navCtrl.pop();

    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this.saveGroupForm();
      });
    });

  }

}
