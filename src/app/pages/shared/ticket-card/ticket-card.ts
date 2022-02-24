import { Component, Input  } from '@angular/core';

// Pages
//import { TicketResultPage } from '../pages/ticket-result/ticket-result';

@Component({
  selector: 'ticket-card',
  templateUrl: 'ticket-card.html'
})
export class TicketCard {
	
	// a reference to a ticket object
	@Input() ticket: any;
	
	constructor() {}
	
	/**
	 * UI Click action to view results of a ticket
	 * @param ticketId, unique ticket id to find results for
	 **/
	actionViewTicketResults(ticketId: number) {
		console.log("actionViewTicketResults",ticketId);
		/*
		this.navCtrl.push(TicketResultPage, {
			ticketId: ticketId
		});
*/
	}
	
	
}