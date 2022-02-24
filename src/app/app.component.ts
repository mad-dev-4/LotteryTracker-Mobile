import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NavController, AlertController, ModalController, Platform } from '@ionic/angular';

import { User } from '../providers/user';
import { LTCache } from '../providers/lt-cache';
import { EventsService } from '../events/events-service';

// Page Services
import { LoginserviceService } from './services/loginservice.service';

// Pages
import { LoginPage } from './pages/login/login.page';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  rootPage;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    public platform: Platform,
    public user: User,
    public cache: LTCache,
    public modalCtrl: ModalController,
    public events: EventsService,
    public loginService: LoginserviceService) {

    this.initializeApp();

    this.cache.load().then(() => {

      this.loginService.setIsModal(false);

      console.log("app.component.ts: constructor");

      // go to the root tab page
      this.router.navigate(['tabs']);

      /*
      // check if the user is authenticated on the system
      this.user.isAuthenticatedDeepCheck().subscribe((resp) => {
        this.loginService.setIsModal(false);
        this.router.navigate(['tabs']);
        console.log("app.component.ts: isAuthenticatedDeepCheck()=true");
      }, (err) => {
        // go to the tabs page
        this.router.navigate(['tabs']);
        console.log("app.component.ts: isAuthenticatedDeepCheck()=false");
      });
      */

    });

  }

  initializeApp() {
    // set languages
    this.translateService.setDefaultLang('en');

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //splashScreen.hide();

      /* 
       * Listen to a session expired event.  If sent, we must show the relogon page
       */
      this.events.getObservable().subscribe((data) => {
        console.log("Event received:", data);

        if (data != null && data.user != null && data.user == 'sessionExpired') {
          console.log("Event: user:sessionExpired");
          console.log("Event observable: " + data.observable);
          this.presentModal(data);
        }
      });
    });
  }


  async presentModal(data) {
    const reloadObservable = data.observable;
console.log("***presentModal***");
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      componentProps: { errorMessageKey: data.errorMessageKey, isModal: true }
    });
    modal.onDidDismiss().then(x => {
      console.log("***dismiss presentModal***");
      if (x == null || x.data == null || x.data.retry == null || x.data.retry == true) {
        // send message that the modal was dismissed
        reloadObservable.next("*");
      }
    });

    console.log("***await present presentModal***");
    await modal.present();

  }

}
