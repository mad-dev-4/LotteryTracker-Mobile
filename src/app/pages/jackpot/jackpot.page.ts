import { Component, OnInit } from '@angular/core';
import { User } from '../../../providers/user';
import { PageHelper } from '../../../providers/page-helper';
import { Logger } from '../../../providers/logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.page.html',
  styleUrls: ['./jackpot.page.scss'],
})
export class JackpotPage implements OnInit {

  jackpots;

  constructor(
    public userProvider: User,
    public logger: Logger,
    public pageHelper: PageHelper) {

    this._getFutureJackpots();
  }// end constructor

  ngOnInit() {
  }

  _getFutureJackpots() {
    this.logger.entry("JackpotPage", "_getFutureJackpots");

    this.userProvider.getFutureJackpots().subscribe((resp) => {
      this.jackpots = resp;

      this.pageHelper.hideLoader();
      this.logger.trace("JackpotPage", "_getFutureJackpots", "jackpots: " + this.jackpots.length);


    }, (err) => {
      this.logger.trace("JackpotPage", "_getFutureJackpots", "Error");
      this.pageHelper.processRequestError(err).subscribe((resp) => {
        this._getFutureJackpots();
      });
    });
  }

}
