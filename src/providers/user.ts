import { Injectable, isDevMode } from '@angular/core';
import { LTCache } from './lt-cache';
import { environment } from '../environments/environment';
import { finalize, map, shareReplay, tap } from "rxjs/operators";
import { HttpParams, HttpClient } from '@angular/common/http';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;
  url: string = environment.hostUrl;

	constructor(
		public http: HttpClient, 	
		public cache: LTCache) {
  }

  
  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    const query = this.http.post<any>(this.url + 'auth', accountInfo)
    .pipe(
      tap(res => {
        console.log('login() successfull', res);
        if (res.LTToken != null) {
          this._loggedIn(res);
        }
      })
    );
    return query;
  }
  
  /**
	* Returns the current logged in users profile.
	**/
  getProfile() {
    const query = this.http.get<any>(this.url + 'user')
    .pipe(
      tap(res => {
        console.log('getProfile() successfull', res);
      })
    );
    return query;  
	}

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    const query = this.http.post<any>(this.url + 'signup', accountInfo)
    .pipe(
      tap(res => {
        console.log('signup() successfull', res);
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        }
      })
    );
    return query; 
  }

  /**
   * Returns true if the user is authenticated.  This method does not know if the session is expired by default.
   * @Returns boolean 
   **/
	isAuthenticated() {
		if (isDevMode()) {
			console.log("isAuthenticated? " + this.cache.getValue('Username'));
		}

		return this.cache.getValue('Username') != null;
	}
	
	/**
	* Returns true if the user is authenticated.  A negotiation with the server will take place to ensure the user is authenticated.
	* @Returns promise: of a auth check. on success of the promise, we assume the user is authoized
	**/
  isAuthenticatedDeepCheck() {
    // ping the server to see if the auth token is valid
    const query = this.http.get<any>(this.url + 'ping')
    .pipe(
      tap(res => {
        console.log('isAuthenticatedDeepCheck() ping response successfull', res);
      })
    );
    return query;
	}

	/**
	* Log the user out, which forgets the session
	**/
	logout() {
		this.cache.removeKey("Username");
		this.cache.removeKey("LTToken");
	}

	/**
	* Process a login/signup response to store user data
	**/
	_loggedIn(resp) {
		this.cache.setValue('Username', resp.Username);
		this.cache.setValue('LTToken', resp.LTToken);
	}

	/**
	* Gets all alerts/notifications for the current member
	* @Returns promise
	**/
  getAllMembersAlerts() {
    const query = this.http.get<any>(this.url + 'alert')
    .pipe(
      tap(res => {
        console.log('getAllMembersAlerts() successfull', res);
      })
    );
    return query;
	}
	
	/**
	* Gets all known future jackpots in the system 
	* @Returns promise
	**/
  getFutureJackpots() {
    const query = this.http.get<any>(this.url + 'jackpot')
    .pipe(
      tap(res => {
        console.log('getFutureJackpots() successfull', res);
      })
    );
    return query;
	}

	/**
	 * Takes in a Alert Put object and persists it
	 * @param alert: AlertPut object
	 **/
  saveAlert(alertPut: any) {
    const query = this.http.put<any>(this.url + 'alert', alertPut)
    .pipe(
      tap(res => {
        console.log('saveAlert() successfull', res);
      })
    );
    return query;
	}
	
	
	/**
	 * Takes in a User Put object and persists it
	 * @param profile: UserPut object
	 **/
  updateProfile(profile: any) {
    const query = this.http.put<any>(this.url + 'user', profile)
    .pipe(
      tap(res => {
        console.log('updateProfile() successfull', res);
      })
    );
    return query;
	}
	
	/**
	 * Takes in a Change Password Put object and persists it
	 * @param ChangePasswordPut: ChangePasswordPut object
	 **/
  changePassword(changePasswordPut: any) {
    const query = this.http.put<any>(this.url + 'changePassword', changePasswordPut)
    .pipe(
      tap(res => {
        console.log('changePassword() successfull', res);
      })
    );
    return query;
	}
	
	/**
	 * Takes in a User Registration object and posts it to create a user
	 * @param RegisterPost: RegisterPost object
	 **/
  registerUser(registerPost: any) {
    const query = this.http.post<any>(this.url + 'registration', registerPost)
    .pipe(
      tap(res => {
        console.log('registerUser() successfull', res);
      })
    );
    return query;
	}
	
	/**
	 * Takes in a Forgot Password object and posts it to the server
	 * @param forgotPasswordPost: ForgotPasswordPost object
	 **/
  submitForgotPasswordRequest(forgotPasswordPost: any) {
    const query = this.http.post<any>(this.url + 'forgotPassword', forgotPasswordPost)
    .pipe(
      tap(res => {
        console.log('submitForgotPasswordRequest() successfull', res);
      })
    );
    return query;
	}
	
	/**
	* Get the LTToken from the login user response, if the user is logged on
	**/
	getSessionToken() {
		if (this.cache.getValue('Username') != null && this.cache.getValue('LTToken') != null) {
			return this.cache.getValue('LTToken');
		}
			return null;
		}
	}

	

