import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { Group } from '../../../providers/group';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router, ActivatedRoute } from '@angular/router';
import { LTCache } from '../../../providers/lt-cache';

@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.scss'],
})
export class MemberPage implements OnInit {

  // Current signed in users email address
  usersEmail: string;

  // Flag indicating if the current logged in user is an administrator of the current groupId
  userIsAGroupCaptian: boolean = false;

  // Specifies if the list is in reorder modes
  activeUserReorderEnabled: boolean = false;

  // Keeps track if the order changed
  orderHasChanges: boolean = false;

  //activeUserReorderText: string = "Reorder";

  // List of active members, data object
  activeMembers: Array<any> = [];

  // List of in-active members, data object
  inActiveMembers: Array<any> = [];

  // Field used for adding/specifying a new email address of a user to add to the group
  newEmailAddress: string;

  // The groupId being acted on
  groupId: string;

  // Translated error text strings
  private roleCaptain: string;
  private roleMember: string;
  private roleSelect: string;
  private removeSelect: string;
  private removeSelectDelete: string;
  private removeSelectDeactivate: string;
  private addingMemberInProgress: string;
  private saveText: string;
  private reorderText: string;

  constructor(
    public groupProvider: Group,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public logger: Logger,
    public pageHelper: PageHelper,
    public router: Router,
    public actionSheetCtrl: ActionSheetController,
    public route: ActivatedRoute,
    public cache: LTCache,
    public toastController: ToastController,
    public translateService: TranslateService) {

    // load text strings
    this.translateService.get('MEMBER_ROLE_SELECT').subscribe((value) => {
      this.roleSelect = value;
    });
    this.translateService.get('MEMBER_REMOVE_SELECT').subscribe((value) => {
      this.removeSelect = value;
    });
    this.translateService.get('MEMBER_REMOVE_SET_DELETE').subscribe((value) => {
      this.removeSelectDelete = value;
    });
    this.translateService.get('MEMBER_REMOVE_SET_INACTIVE').subscribe((value) => {
      this.removeSelectDeactivate = value;
    });
    this.translateService.get('MEMBER_ROLE_CAPTAIN').subscribe((value) => {
      this.roleCaptain = value;
    });
    this.translateService.get('MEMBER_ROLE_MEMBER').subscribe((value) => {
      this.roleMember = value;
    });
    this.translateService.get('PROGRESS_INVITING').subscribe((value) => {
      this.addingMemberInProgress = value;
    });
    this.translateService.get('BUTTON_SAVE').subscribe((value) => {
      this.saveText = value;
    });
    this.translateService.get('BUTTON_REORDER').subscribe((value) => {
      this.reorderText = value;
    });

    this.usersEmail = cache.getValue(cache.KEY_USER_LOGIN_NAME);
    this.usersEmail = this.usersEmail ? this.usersEmail.toLowerCase() : null;
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.groupId = params['id'];
      }
    });
  }

  ionViewDidEnter() {
    this.logger.entry("MemberPage", "ionViewDidEnter");
    this._getAllGroupMembers();
  }

  _getAllGroupMembers() {
    this.pageHelper.showLoader();

    this.groupProvider.getAllMembersInGroup(this.groupId).subscribe((resp) => {
      let members = resp;

      this.pageHelper.hideLoader();
      this.logger.trace("MemberPage", "_getAllGroupMembers", "Number of members:" + members.length);

      this.activeMembers = [];
      this.inActiveMembers = [];

      // snoop through the groups and mark which group the current user
      // user is a captain of 
      this.userIsAGroupCaptian = false;
      for (let mbr of members) {
        if (mbr.Captain == 1 && mbr.EmailAddress.toLowerCase() == this.usersEmail) {
          this.userIsAGroupCaptian = true;
        }
        if (mbr.FirstName || mbr.LastName) {
          mbr.isRegistered = true;
        } else {
          mbr.isRegistered = false;
        }

        if (mbr.Active) {
          this.activeMembers.push(mbr);
        } else {
          this.inActiveMembers.push(mbr);
        }
      }
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this._getAllGroupMembers();
      });
    });
  }

  /**
   * called to show an action sheet to display role selection options
   * @param emailAddress, the email/username of the member being changed
   **/
  async actionChangeRole(emailAddress: string) {
    let actionSheet = this.actionSheetCtrl.create({
      header: this.roleSelect,
      buttons: [
        {
          text: this.roleCaptain,
          handler: () => {
            this.logger.trace("MemberPage", "actionChangeRole", "Delete clicked: " + emailAddress);
            this.postRoleUpdate(emailAddress, 'setCaptain');
          }
        }, {
          text: this.roleMember,
          handler: () => {
            this.logger.trace("MemberPage", "actionChangeRole", "Archive clicked: " + emailAddress);
            this.postRoleUpdate(emailAddress, 'setNotCaptain');
          }
        }
      ]
    });
    (await actionSheet).present();
  }

  /**
   * Posts an update to the system to change a users role
   **/
  postRoleUpdate(emailAddress: string, role: string) {
    this.pageHelper.showSaver();

    this.groupProvider.updateMemberRole(this.groupId, emailAddress, role).subscribe((resp) => {
      this.pageHelper.hideLoader();
      this.logger.trace("MemberPage", "actionChangeRole", "updated member role successfully");

      // refresh the group list.  simple reload
      this._getAllGroupMembers();
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        // do nothing
      });
    });
  }

  /**
   * Called from a user interface click to remove a user.  Displays an action sheet to ask if user should be set inactive or deleted
   * @param emailAddress, the email/username of the member being changed
   **/
  async actionRemoveActiveMember(emailAddress: string) {
    let actionSheet = this.actionSheetCtrl.create({
      header: this.removeSelect,
      buttons: [
        {
          text: this.removeSelectDelete,
          handler: () => {
            this.logger.trace("MemberPage", "actionChangeRole", "Delete clicked:" + emailAddress);
            this.postRemoveMember(emailAddress, 'removeUser');
          }
        }, {
          text: this.removeSelectDeactivate,
          handler: () => {
            this.logger.trace("MemberPage", "actionChangeRole", "Deactivate clicked:" + emailAddress);
            this.postRemoveMember(emailAddress, 'deactivateUser');
          }
        }
      ]
    });
    (await actionSheet).present();
  }

  /**
   * Called from the UI to remove the member completely from the group
   **/
  actionPostRemoveMember(emailAddress: string) {
    this.postRemoveMember(emailAddress, 'removeUser');
  }

  /**
   * Posts an update to the system to delete or deactivate a user
   **/
  postRemoveMember(emailAddress: string, action: string) {
    this.pageHelper.showSaver();

    this.groupProvider.removeMember(this.groupId, emailAddress, action).subscribe((resp) => {
      this.pageHelper.hideLoader();
      this.logger.trace("MemberPage", "postRemoveMember", "Update successfull for user: " + action);

      // refresh the group list.  simple reload
      this._getAllGroupMembers();
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        // do nothing
      });
    });
  }

  /**
   * Click action
   **/
  actionActivateMember(emailAddress: string) {
    this.postRemoveMember(emailAddress, "activateUser");
  }

  /**
   * Adds a new member to the group.
   **/
  actionAddGroupMember() {
    this.logger.entry("MemberPage", "actionAddGroupMember", "EmailAddress: " + this.newEmailAddress);

    this.pageHelper.showSaver();

    this.groupProvider.addGroupMember(this.groupId, this.newEmailAddress).subscribe((resp) => {
      this.pageHelper.hideLoader();
      this.logger.entry("MemberPage", "actionAddGroupMember", "Member added successfully");

      // add the responding new member object into our list (at the top)
      this.activeMembers.unshift(resp);

      // reset value
      this.newEmailAddress = "";
    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        // do nothing
      });
    });
  }

  /**
   * Moves a member to a specific sequence in the list
   * @param emailAddress, the email address of the member to move
   * @param sequecne, the sequence to move the member to (position in the list)
   **/
  async actionSaveMemberSequence(ev: CustomEvent<ItemReorderEventDetail>) {
    this.logger.entry("MemberPage", "actionMoveMemberSequence");
    this.logger.trace("MemberPage", "actionSaveMemberSequence()", "Dragged from index " + ev.detail.from + "to" + ev.detail.to);

    this.pageHelper.showSaver();

    // move elements in array
    this.activeMembers[i] = this.array_move(this.activeMembers, ev.detail.from, ev.detail.to);

    // build array to post to server
    let putList: Array<any> = [];
    for (var i = 0; i < this.activeMembers.length; i++) {
      let nvp = { "EmailAddress": this.activeMembers[i].EmailAddress, "Sequence": i };
      putList.push(nvp);
    };

    this.groupProvider.updateMemberSequence(this.groupId, putList).subscribe((resp) => {
      this.pageHelper.hideLoader();
      this.logger.trace("MemberPage", "actionMoveMemberSequence", "updated member sequence successfully");

    }, (err) => {
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        ev.detail.complete();
      });
    },
      () => {
        ev.detail.complete();
      });
  }

  /**
   * Moves an element inside an array
   * @param arr Array pointer
   * @param old_index index in the array starting at 0
   * @param new_index new index to move the old index to
   * @returns new array object
   */
  private array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };

  /**
   * Reorders items in the UI
   **/
  reorderItems(ev: CustomEvent<ItemReorderEventDetail>) {
    this.logger.entry("MemberPage", "reorderItems");
    //this.activeMembers = reorderArray(this.activeMembers, event);
    this.orderHasChanges = true;

    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    if (ev.detail.from != ev.detail.to) {
      this.actionSaveMemberSequence(ev);
    } else {
      // Finish the reorder and position the item in the DOM
      ev.detail.complete();
    }
  }

}
