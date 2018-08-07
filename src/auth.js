import {Promise} from 'bluebird';
import {Enum} from 'ctjs-util';

export const AuthStorageType = new Enum({
  LOCAL: null,
  SESSION: null
});

export class Auth {

  constructor(config) {
    config = config != null ? config : {};
    this.tokenName = config.tokenName ? config.tokenName : 'token';
    this.authToken = config.authToken ? config.authToken : 'Token';
    this.storageType = config.storageType ? config.storageType : AuthStorageType.LOCAL;
    this.authHeader = config.authHeader ? config.authHeader : 'Authorization';
    this.storage = new AuthStorage(this.storageType);

    Object.freeze(this);
  }

  isAuthenticated() {
    let token = this.storage.get(this.tokenName);

    // There's no token, so user is not authenticated.
    if (!token) {
      return false;
    }

    // There is a token, but in a different format. Return true.
    if (token.split('.').length !== 3) {
      return true;
    }

    let exp;
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      exp = JSON.parse(window.atob(base64)).exp;
    } catch (error) {
      return false;
    }

    if (exp) {
      return Math.round(new Date().getTime() / 1000) <= exp;
    }
    return true;
  }

  loginSuccess(token) {
    this.storage.set(this.tokenName, token);
  }

  logout() {
    return new Promise(resolve => {
      this.storage.remove(this.tokenName);
      resolve();
    });
  }

  readToken() {
    let token = this.storage.get(this.tokenName);

    if (this.authHeader && this.authToken) {
      token = `${this.authToken} ${token}`;
    }
    return token;
  }

}

class AuthStorage {
  constructor(storageType) {
    this.storageType = storageType;
  }

  get(key) {
    switch (this.storageType) {
      case AuthStorageType.LOCAL:
        if ('localStorage' in window && window['localStorage'] != null) {
          return localStorage.getItem(key);
        } else {
          console.warn('Warning: Local Storage is disabled or unavailable'); // eslint-disable-line no-console
          return undefined;
        }
        break;

      case AuthStorageType.SESSION:
        if ('sessionStorage' in window && window['sessionStorage'] != null) {
          return sessionStorage.getItem(key);
        } else {
          console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.'); // eslint-disable-line no-console
          return undefined;
        }
        break;

      default:
          console.warn('Warning: Unsupported storage type ' + this.storageType); // eslint-disable-line no-console
          return undefined;
    }
  }

  set(key, value) {
    switch (this.storageType) {
      case AuthStorageType.LOCAL:
        if ('localStorage' in window && window['localStorage'] != null) {
          return localStorage.setItem(key, value);

        } else {
          console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.'); // eslint-disable-line no-console
          return undefined;
        }
        break;

      case AuthStorageType.SESSION:
        if ('sessionStorage' in window && window['sessionStorage'] != null) {
          return sessionStorage.setItem(key, value);
        } else {
          console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.'); // eslint-disable-line no-console
          return undefined;
        }
        break;

      default:
        console.warn('Warning: Unsupported storage type ' + this.storageType); // eslint-disable-line no-console
        return undefined;

    }
  }

  remove(key) {
    switch (this.storageType) {
      case AuthStorageType.LOCAL:
        if ('localStorage' in window && window['localStorage'] != null) {
          return localStorage.removeItem(key);
        } else {
          console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.');  // eslint-disable-line no-console
          return undefined;
        }
        break;

      case AuthStorageType.SESSION:
        if ('sessionStorage' in window && window['sessionStorage'] != null) {
          return sessionStorage.removeItem(key);

        } else {
          console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');  // eslint-disable-line no-console
          return undefined;
        }
        break;

      default:
        console.warn('Warning: Unsupported storage type ' + this.storageType); // eslint-disable-line no-console
        return undefined;
    }
  }
}
