import { Component } from '@angular/core';
import { IonTabs } from '@ionic/angular'

import { Logger } from './../../providers/logger';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  private activeTab?: HTMLElement;

  constructor(public logger: Logger) { }

  // Register all tab changes
  tabChange(tabsRef: IonTabs) {
    if (tabsRef.outlet.activatedView) {
      this.activeTab = tabsRef.outlet.activatedView.element;
    }
  }

  ionViewWillEnter() {
    this.logger.entry("TabsPage", "ionViewWillEnter");
    this.propagateToActiveTab('ionViewWillEnter');
  }

  ionViewDidEnter() {
    this.logger.entry("TabsPage", "ionViewDidEnter");
    this.propagateToActiveTab('ionViewDidEnter');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      // force ionViewWillEnter call for all tabs.  
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }
}
