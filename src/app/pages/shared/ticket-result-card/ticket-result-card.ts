import { Component, Input  } from '@angular/core';

@Component({
  selector: 'ticket-result-card',
  templateUrl: 'ticket-result-card.html'
})
export class TicketResultCard {
	
	// reference to the primary game object
	@Input() game: any;
	
	// reference to the secondary game. i.e. encore, extra
	@Input() otherGame: any;
	
	// a reference to a ticket object
	@Input() ticket: any;
	
	// a reference to a specific ticket draw result object
	@Input() ticketDrawResult: any;
	
	
	constructor() {

	}
	
	/**
	 * This method is called on every page view
	 **/
	ionViewWillEnter() {
		

	}
}