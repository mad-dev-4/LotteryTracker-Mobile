import { Component, OnInit } from '@angular/core';

import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { User } from '../../../providers/user';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.page.html',
  styleUrls: ['./menu-tab.page.scss'],
})
export class MenuTabPage implements OnInit {

  constructor(
    public user: User,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  	// sign out of the app and go to the start page
	actionSignOut() {
		// kill credentials in memory
		this.user.logout();
		
		// go back to the login home screen
		this.router.navigate(['']);
	}

}
