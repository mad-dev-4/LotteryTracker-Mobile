import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { map, shareReplay, tap } from "rxjs/operators";
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';

/*
  Used to manage group data
*/
@Injectable()
export class Group {

	url: string = environment.hostUrl;

	// variables used to cache the groups list
	private _allUserGroups: any;
	//private _allUserGroupsObservable: Observable<any>;

	constructor(
		private http: HttpClient) {
	}

	/**
	 * Gets all recent winning numbers.  
	 **/
	getRecentWinnings(drawWinningNumbersId: number = 0) {
		const params = { recent: 'true' };
		const query = this.http.get<any>(this.url + 'winningNumbers', { params: params })
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	 * Gets winning numbers for previous or next draw.  
	 * @param drawWinningNumbersId, the unique Id of the drawWinningNumebrs to get the previous/next results of.
	 **/
	getPrevNextWinnings(drawWinningNumbersId: number = 0, previous: boolean = true) {
		let params = previous ? { prevCurrentNext: '-1'} : { prevCurrentNext: '1'};
		const query = this.http.get<any>(this.url + 'winningNumbers/' + drawWinningNumbersId, { params: params })
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	* Gets all groups the user belongs to
	* @Returns promise
	
	getAllUserGroupsOOOLD() {
		// search cache for the group list
		if (this._allUserGroups) {
			// if data is available, then return the data
			return Observable.of(this._allUserGroups); 
		} else if(this._allUserGroupsObservable) {
			// if this._allUserGroupsObservable is set then the request is in progress
			// return the observable object for the caller to keep waiting
			return this._allUserGroupsObservable;
		} else {
			let params = new URLSearchParams();
			params.set('getStats', 'true'); 
			let options = new RequestOptions({ });
			options.search = params;
			
			// make the actual request
			this._allUserGroupsObservable = this.http.get('group', options)
				.map(res => {
					if(res.status == 200) {
						// observable is no longer needed when data is available
						this._allUserGroupsObservable = null;
						this._allUserGroups = res;
						return this._allUserGroups;
					}else {
						// need to return something
						console.log("request status: " + res.status);
					}
				}).share();//.catch(this.handleError);
			return this._allUserGroupsObservable;
		}
  }

	private handleError(error:any) {
		let errMsg = (error.message) ? error.message :
		error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg); // log to console instead
		return Observable.throw(errMsg);
	}
	*/

	/**
	* Gets all groups the user belongs to.
	* @Returns Observable<json>
	*/
	getAllUserGroups(): Observable<any> {
		let params = new HttpParams();
		params = params.set('getStats', 'true');

		const query = this.http.get<any>(this.url + 'group', { params: params })
		.pipe(
			tap(res => {
				this._allUserGroups = res;
				return this._allUserGroups;
			})
		);
		return query;
	}

	/**
	* Gets group details
	* @Param groupId, the unique ID of the group
	* @Returns promise
	*/
	getGroup(groupId: string) {
		const query = this.http.get<any>(this.url + 'group/' + groupId)
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	 * Takes in a Group object and persists it
	 * @param group: Group object
	 **/
	saveGroup(groupPut: any) {
		const query = this.http.put<any>(this.url + 'group/', groupPut)
		.pipe(
			tap(res => {
				// clear any group cache we may have
				this._allUserGroups = null;
			})
		);
		return query;
	}

	/**
	 * Takes in a Group Id and deletes it
	 * @param group: Group ID
	 **/
	deleteGroup(groupId: string) {

		// shareReplay() is to ensure that only one HTTP request will be made to the backend in the first subscription, 
		// and then the result of that request will be served from memory to any other subsequent subscribers
		const query = this.http.delete<any>(this.url + 'group/' + groupId)
		.pipe(
			tap(res => {
				// clear any group cache we may have
				this._allUserGroups = null;
			})
		);
		return query;
	}

	/**
	 * Creates a new group
	 * @param groupName: the name of the group
	 **/
	createGroup(groupName: string) {
		let groupPost = { "Name": groupName };
		const query = this.http.post<any>(this.url + 'group', groupPost)
		.pipe(
			tap(res => {
				// clear any group cache we may have
				this._allUserGroups = null;
			})
		);
		return query;
	}

	/**
	 * Posts a new meesage to the group wall.
	 * @param groupId of the group to post the message to
	 * @param comment to leave
	 * @param emailGroup set to true to email this message to all group members
	 **/
	postNewMessage(groupId: string, comment: string, emailGroup: boolean) {
		let wallPost = { "GroupId": groupId, "modifiedMessage": comment, "emailNotifyGroup": emailGroup };
		const query = this.http.post<any>(this.url + 'wall', wallPost)
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	 * Puts an update to a users role
	 * @param groupId of the group to update
	 * @param emailAddress of the member to set the role of
	 * @param role string of either setCaptain or setNotCaptain
	 **/
	updateMemberRole(groupId: string, emailAddress: string, role: string) {
		let memberPut = { "GroupId": groupId, "EmailAddress": emailAddress, "Action": role };
		const query = this.http.put<any>(this.url + 'member', memberPut)
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	 * Moves a member to a specific sequence in the list
	 * @param groupId of the group to update
	 * @param putBody, a list of email address and their sequence
	 **/
	updateMemberSequence(groupId: string, putBody: Array<any>) {
		let memberPutS = { "GroupId": groupId, "UpdateSequence": putBody, "Action": "setSequence" };
		const query = this.http.put<any>(this.url + 'member', memberPutS)
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	 * Removes a member from a group
	 * @param groupId of the group to update
	 * @param emailAddress, the email address of the member to remove
	 * @param action, deactivateUser, activateUser, removeUser 
	 **/
	removeMember(groupId: string, emailAddress: string, action: string) {
		let memberPut = { "GroupId": groupId, "EmailAddress": emailAddress, "Action": action };
		const query = this.http.put<any>(this.url + 'member', memberPut)
		.pipe(
			tap(res => {
			})
		);
		return query;
	}


	/**
	 * Adds a member to the specified group.  Sends an email as well
	 * @param groupId of the group to update
	 * @param emailAddress of the member to set the role of
	 **/
	addGroupMember(groupId: string, emailAddress: string) {
		let memberPost = { "GroupId": groupId, "EmailAddress": emailAddress, "SendNotifications": true };
		const query = this.http.post<any>(this.url + 'member', memberPost)
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	* Gets all members in the users current/selected group
	* @Returns promise
	*/
	getAllMembersInGroup(groupId: string) {
		let params = new HttpParams();
		params = params.set('groupId', groupId);

		const query = this.http.get<any>(this.url + 'member', { params: params }) 
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	 * Gets all tickets in a group
	 * @param groupId, the groupId to query for
	 * @param pageNumber, page number of results starting at 0 
	 * @param status, 0: all, 1: active, 2: historical, 3: recent 
	 * @Returns promise
	 **/
	getAllTicketsInGroup(groupId: string, pageNumber: number, status: number = 0) {
		let params = new HttpParams();
		params = params.set('groupId', groupId);
		params = params.set('pageNumber', pageNumber + "");

		let api = 'ticket';
		if (status != 0) {
			api = 'ticketbystatus/active';
			params = params.set('status', status.toString());
		}

 		const query = this.http.get<any>(this.url + api, { params: params })
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	 * Gets a specific ticket with results
	 * @param ticketId, the unique ID of a ticket
	 * @param fetchResults, if true ticket results will be returned with the ticket
	 * @Returns promise
	 **/
	getTicket(ticketId: string, fetchResults: boolean) {
		let params = new HttpParams();
		params = params.set('showTicketResultDraw', fetchResults ? "true" : "false");

		const query = this.http.get<any>(this.url + 'ticket/' + ticketId, { params: params })
		.pipe(
			tap(res => {
			})
		);
		return query;
	}


	/**
	* Gets data from the group wall
	* @Returns promise
	*/
	getCards(pageNumber: number) {
		let params = new HttpParams();
		params = params.set('pageNumber', pageNumber + "");
		params = params.set('typeOfMessage', "2");

		const query = this.http.get<any>(this.url + 'wall', { params: params })
		.pipe(
			tap(res => {
			})
		);
		return query;
	}



	/**
	* Gets all games that tickets can be created for.
	* @Param provinceCode, a province code (i.e ON, BC) to filter the list by
	* @Returns promise
	*/
	getCreatableGames(provinceCode: string) {
		let params = new HttpParams();
		params = params.set('provinceCode', provinceCode);
		params = params.set('onlyCreatableGames', "true");

		const query = this.http.get<any>(this.url + 'game', { params: params })
		.pipe(
			tap(res => {
			})
		);
		return query;
	}

	/**
	* Gets game details
	* @Param gameId, the unique ID of the game
	* @Returns promise
	*/
	getGame(gameId: string) {
		const query = this.http.get<any>(this.url + 'game/' + gameId)
		.pipe(
			tap(res => {
			})
		);
		return query;
	}
}
