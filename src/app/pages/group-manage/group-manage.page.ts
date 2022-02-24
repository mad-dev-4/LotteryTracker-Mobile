import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Group } from '../../../providers/group';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';
import { LTCache } from '../../../providers/lt-cache';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.page.html',
  styleUrls: ['./group-manage.page.scss'],
})
export class GroupManagePage implements OnInit {

  // Translation strings
  textWarning1 = "";
  textWarning2 = "";
  textCancel = "";
  textDelete = "";

  // Current signed in users email address
  usersEmail: string;

  // groups data object
  groups: any;
  noGroups: boolean = false;

  constructor(
    public navCtrl: NavController,
    public groupProvider: Group,
    public alertCtrl: AlertController,
    public cache: LTCache,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public logger: Logger,
    public pageHelper: PageHelper,
    public router: Router,
    public translateService: TranslateService) {

    this.usersEmail = cache.getValue(cache.KEY_USER_LOGIN_NAME);
    this.usersEmail = this.usersEmail ? this.usersEmail.toLowerCase() : null;

    // load text strings
    this.translateService.get('GROUP_MANAGE_WARNING1').subscribe((value) => {
      this.textWarning1 = value;
    });
    this.translateService.get('GROUP_MANAGE_WARNING2').subscribe((value) => {
      this.textWarning2 = value;
    });
    this.translateService.get('GROUP_MANAGE_CANCEL').subscribe((value) => {
      this.textCancel = value;
    });
    this.translateService.get('GROUP_MANAGE_DELETE').subscribe((value) => {
      this.textDelete = value;
    });

  } // end constructor

  ngOnInit() {
  }

  /**
 * This method is called on every page view
 **/
  ionViewWillEnter() {
    this.loadGroups();
  }

  loadGroups() {
    this.logger.entry("GroupManagePage", "loadGroups");

    this.pageHelper.showLoader();

    // Load group data and change the UI model to reflect
    this.groupProvider.getAllUserGroups().subscribe((resp) => {
      this.groups = [];

      if (resp.length == 0) {
        this.noGroups = true;
      } else {
        // snoop through the groups and mark which group the current user
        // user is a captain of 
        for (let grp of resp) {
          if (grp.GroupCaptains) {

            for (let cptn of grp.GroupCaptains) {
              if (cptn.EmailAddress.toLowerCase() == this.usersEmail) {
                grp.isCaptain = true;
                this.groups.push(grp);
                break;
              }
            }

          }
        }
      }

      this.pageHelper.hideLoader();
      this.logger.trace("GroupManagePage", "loadGroups", "Number of groups:" + this.groups.length);

    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this.loadGroups();
      });
    });
  }

  // UI button to delete a group 
  async deleteGroup(groupId: string, groupName: string, warningNumber = 0) {
    const warningMsg = warningNumber == 0 ?
      this.textWarning1.split("{{0}}").join(groupName) :
      this.textWarning2.split("{{0}}").join(groupName);

    const alert = await this.alertCtrl.create({
      header: warningMsg,
      buttons: [
        {
          text: this.textCancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.textDelete,
          handler: () => {
            if (warningNumber == 0) {
              this.deleteGroup(groupId, groupName, 1);
            }else {
              this.callDelete(groupId);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async callDelete(groupId: string) {
    this.logger.entry("GroupManagePage", "callDelete");

    this.pageHelper.showLoader();

    // Load group data and change the UI model to reflect
    this.groupProvider.deleteGroup(groupId).subscribe((resp) => {
      this.pageHelper.hideLoader();
      let tempGroups = [];
      
      for (let grp of this.groups) {
        if ( grp.GroupId != groupId) {
          tempGroups.push(grp);
        }
      }
      this.groups = tempGroups;
      this.logger.trace("GroupManagePage", "callDelete", "Number of groups:" + this.groups.length);

    }, (err) => {
      this.logger.trace("GroupManagePage", "callDelete", "Failed for group Id:" + groupId);
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        //this.callDelete(groupId);
      });
    });

  }

}
