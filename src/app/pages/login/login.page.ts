import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { User } from '../../../providers/user';
import { LTCache } from '../../../providers/lt-cache';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { LoginserviceService } from '../../services/loginservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // The account data type (for the login form)
  account: { UserName: string, Password: string, RememberMe: boolean } = {
    UserName: '',
    Password: '',
    RememberMe: true
  };

  private errorMessageKey: string;
  private isModal: boolean;

  constructor(
    public translateService: TranslateService,
    public pageHelper: PageHelper,
    public router: Router,
    public loginService: LoginserviceService,
    public user: User,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public cache: LTCache,
    public logger: Logger,
    public toastController: ToastController) {

    // check if this page was brought up as a modal/popover
    this.isModal = loginService.getIsModal();
    this.errorMessageKey = loginService.getErrorMessageKey();
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.account.UserName = this.cache.getValue(this.cache.KEY_LOGIN_USERNAME);
    this.account.RememberMe = this.cache.getValue(this.cache.KEY_LOGIN_REMEMBERME);

    if (this.errorMessageKey != null && this.errorMessageKey != '') {
      this.translateService.get(this.errorMessageKey).subscribe((value) => {
        this.errorMessageKey = value;
        this.showToast(value);
      });
    }
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

  // Attempt to login in through our User service
  async doLogin() {
    this.logger.entry("LoginPage", "doLogin");

    if (this.account.UserName === '' || this.account.Password === '') {
      /*let alert = await this.alertCtrl.create({
        header: this.pageHelper.loginErrorTitle,
        message: this.pageHelper.loginErrorEmptyParam,
        buttons: ['OK']
      });
      await alert.present();
*/

      this.showToast(this.pageHelper.loginErrorEmptyParam);
      return;
    }

    // show loader and login
    this.pageHelper.showLoader();
    this.loginNow();
  }// end doLogin

  private loginNow() {
    this.user.login(this.account).subscribe((resp) => {
      this.logger.trace("LoginPage", "doLogin", "Login Successful");

      if (this.account.RememberMe) {
        // cache the username on login success
        this.cache.setValue(this.cache.KEY_LOGIN_USERNAME, this.account.UserName);
        this.cache.setValue(this.cache.KEY_LOGIN_REMEMBERME, this.account.RememberMe);
      } else {
        // cache the username on login success
        this.cache.removeKey(this.cache.KEY_LOGIN_USERNAME);
        this.cache.removeKey(this.cache.KEY_LOGIN_REMEMBERME);
      }
      this.pageHelper.hideLoader();

      // Load the users default province selection if its not in memory already
      if (this.cache.getValue(this.cache.KEY_DEFAULT_PROVINCE) == null) {
        this.user.getProfile().subscribe(resp => {
          this.cache.setValue(this.cache.KEY_DEFAULT_PROVINCE, resp.ProvinceCode);
        });
      }

      if (this.isModal) {
        this.modalCtrl.dismiss({});
      } else {
        this.router.navigate(['']);
      }
    }, (err) => {
      this.logger.trace("LoginPage", "doLogin", "Login failed");

      this.pageHelper.hideLoader();

      this.openErrorModule();
    });
  }

  async openErrorModule() {
    // Unable to log in
    /*
    const alert = await this.alertCtrl.create({
      header: this.pageHelper.loginErrorTitle,
      message: this.pageHelper.loginInIncorrect,
      buttons: ['OK']
    });
    await alert.present();
  */
    this.showToast(this.pageHelper.loginInIncorrect);
  }

  public forgotPasswordLink() {
    this.router.navigate(['forgot-password']).then(x => {
      if (this.isModal) {
        this.modalCtrl.dismiss({"retry": false});
      }
    });
  }

}
