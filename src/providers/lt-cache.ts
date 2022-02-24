import { Injectable, isDevMode } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * A simple key/value pairs storage class with persistence.
 */
@Injectable()
export class LTCache {
	private STORAGE_KEY: string = '_LT_Cache_Key';

	// Some default keys stored in the cache
	public KEY_DEFAULT_PROVINCE = 'ProvincePreference';
	public KEY_HEADER_TOKEN = 'LTToken';
	public KEY_USER_LOGIN_NAME = 'Username';
	public KEY_LOGIN_USERNAME = 'Login_Username';
	public KEY_LOGIN_REMEMBERME = 'Login_RememberMe';

	_nvpStorage: any;
	_defaults: any;
	_readyPromise: Promise<any>;

	constructor(public storage: Storage, defaults: any) {
		this._defaults = defaults;
	}

	/**
	 * Loads all values from local storage given the STORAGE_KEY and merges default values
	 **/
	load() {
		console.log("LTCache.load(): loading from storage");
		
		return this.storage.get(this.STORAGE_KEY).then((value) => {
			if(value) {
				this._nvpStorage = value;
				this._mergeDefaults(this._defaults);
			} else {
				this.setAll(this._defaults).then((val) => {
					this._nvpStorage = val;
				})
			}
			
			if (isDevMode()) {
				console.log("Dumping all LTCache data:");
				let str = JSON.stringify(this._nvpStorage);
				str = JSON.stringify(this._nvpStorage, null, 4); // (Optional) beautiful indented output.
				console.log(str);
			}
		});
	}

	/**
	 * Private method
	 * Merges any keys that may exist with new ones.  Called on load() when some stored values need to be merged with existing defaults.
	 * @param defaults: default values
	 * @return null (for all intensive purposes)
	 **/
	_mergeDefaults(defaults: any) {
		for(let k in defaults) {
			if(!(k in this._nvpStorage)) {
				this._nvpStorage[k] = defaults[k];
			}
		}
		return this.setAll(this._nvpStorage);
	}

	/**
	 * Private
	 **/
	merge(_nvpStorage: any) {
		for(let k in _nvpStorage) {
			this._nvpStorage[k] = _nvpStorage[k];
		}
		return this.save();
	}

	/**
	 * Private
	 **/
	save() {
		return this.setAll(this._nvpStorage);
	}

	/**
	 * Private
	 **/	
	setAll(value: any) {
		return this.storage.set(this.STORAGE_KEY, value);
	}


	

	




	/**
	 * Returns true if the specified key is in cache
	 * @param key: key to search for
	 **/
	contains(key: string) {
		return this._nvpStorage != null && (key in this._nvpStorage);
	}
	/**
	 * Removes a key/value from storage
	 * @param key: key to removeAttribute
	 **/
	removeKey(key: string) {
		delete this._nvpStorage[key]; 
		this.storage.set(this.STORAGE_KEY, this._nvpStorage);
	}
	
	/**
	 * Gets a specific value from storage given a key.
	 * @param key: the unique key
	 * @return any
	 **/
	getValue(key: string) {
		return this.contains(key) ? this._nvpStorage[key] : null;
	}

	/**
	 * Sets a specific key/value pair and saves it in storage.
	 * @param key: the unique key
	 * @param value: the value assigned to the key
	 * @return: void
	 **/
	setValue(key: string, value: any) {
		this._nvpStorage[key] = value;
		this.storage.set(this.STORAGE_KEY, this._nvpStorage);
	}
}
