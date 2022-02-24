import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Group } from '../../../providers/group';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';
import { LTCache } from '../../../providers/lt-cache';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  // Current signed in users email address
  usersEmail: string;

  // groups data object
  groups: any; //[{groupId: number, groupName: string, groupCaptainName: string}];
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
    public router: Router) {

    this.usersEmail = cache.getValue(cache.KEY_USER_LOGIN_NAME);
    this.usersEmail = this.usersEmail ? this.usersEmail.toLowerCase() : null;

  } // end constructor


	ngOnInit() {
	}
  
  /**
 * This method is called on every page view
 **/
  ionViewWillEnter() {
    this.logger.entry("GroupPage", "ionViewWillEnter");
    this.loadGroups();
  }


  loadGroups() {
    this.logger.entry("GroupPage", "loadGroups");

    this.pageHelper.showLoader();

    // Load group data and change the UI model to reflect
    this.groupProvider.getAllUserGroups().subscribe((resp) => {
      this.groups = resp;
      if (this.groups.length == 0) {
        this.noGroups = true;
      } else {
        // snoop through the groups and mark which group the current user
        // user is a captain of 
        for (let grp of this.groups) {
          if (grp.GroupCaptains) {

            for (let cptn of grp.GroupCaptains) {
              if (cptn.EmailAddress.toLowerCase() == this.usersEmail) {
                grp.isCaptain = true;
                break;
              }
            }

          }
        }
      }

      this.pageHelper.hideLoader();
      this.logger.trace("GroupPage", "loadGroups", "Number of groups:" + this.groups.length);

    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this.loadGroups();
      });
    });
  }

  // UI button to edit a group name/properties
  actionEdit(groupId: string) {
    if (groupId) {
      this.router.navigate(['group-edit', groupId]);
    }
  }

  // UI button to view group members
  actionMembers(groupId: string) {
    if (groupId) {
      this.router.navigate(['member', groupId]);
    }
  }

  // UI button to view all group tickets
  actionViewTickets(groupId: string) {
    if (groupId) {
      this.router.navigate(['ticket-list', groupId]);
    }
  }

  // UI button to add a group tickets
  actionAddTicket(groupId: string, groupName: string) {
    this.logger.trace("GroupPage", "actionAddTicket", "GroupId:" + groupId + ", GroupName:" + groupName);
    if (groupId) {
      this.router.navigate(['ticket-new', groupId, groupName]);
    }
  }

}
