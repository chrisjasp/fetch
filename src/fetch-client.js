import {UrlBuilder, Util} from 'ctjs-util';
import {Promise} from 'bluebird';
import {ErrorResponse} from './error-response';
import {WorkingOverlay} from './fetch-interceptors';

export class FetchClient {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  addInterceptor(interceptor) {
    if (Util.isFunction(interceptor.request)) {
      this.requestInterceptors.push(interceptor);
    }
    if (Util.isFunction(interceptor.response)) {
      this.responseInterceptors.push(interceptor);
    }
  }

  buildUrl(...pathArgs) {
    return new UrlBuilder(this.baseUrl).path(pathArgs).build();
  }

  get(...pathArgs) {
    return new AjaxRequest(this, 'GET', pathArgs);
  }

  post(...pathArgs) {
    return new AjaxRequest(this, 'POST', pathArgs);
  }

  put(...pathArgs) {
    return new AjaxRequest(this, 'PUT', pathArgs);
  }

  delete(...pathArgs) {
    return new AjaxRequest(this, 'DELETE', pathArgs);
  }

}

export class AjaxRequest {
  constructor(fetchClient, method, pathArgs) {
    this.urlBuilder = new UrlBuilder(fetchClient.baseUrl);
    if (pathArgs) {
      this.urlBuilder.path(pathArgs);
    }
    this._method = method;
    this._body = null;
    this.headers = new Headers();
    this.requestInterceptors = fetchClient.requestInterceptors.slice();
    this.responseInterceptors = fetchClient.responseInterceptors.slice();
  }

  withInterceptor(interceptor) {
    if (Util.isFunction(interceptor.request)) {
      this.requestInterceptors.push(interceptor);
    }
    if (Util.isFunction(interceptor.response)) {
      this.responseInterceptors.push(interceptor);
    }
    return this;
  }

  path(...pathArgs) {
    this.urlBuilder.path(pathArgs);
    return this;
  }

  query(query) {
    this.urlBuilder.query(query);
    return this;
  }

  body(body) {
    this._body = body;
    return this;
  }

  jsonBody(jsonBody) {
    if (!this.headers.has('Content-Type')) {
      this.headers.append('Content-Type', 'application/json');
    }
    this._body = toJsonBlob(jsonBody);
    return this;
  }

  send() {
    // Apply request interceptors.
    this.requestInterceptors.forEach(interceptor => {
      interceptor.request(this);
    });

    // Perform the fetch (returns a promise)
    let config = {
      method: this._method,
      headers: this.headers
    };
    if (this._body) {
      config.body = this._body;
    }
    let p = fetch(this.url, config)
        .catch((e) => {
          let overlay = this.responseInterceptors.find((t) => {
            return t instanceof WorkingOverlay;
          });
          overlay.response();
          localStorage.clear();
          sessionStorage.clear();
          return ErrorResponse.build(e);
        });

    // Convert to a bluebird promise.
    let bluebirdPromise = Promise.resolve(p);


    // Apply response interceptors
    this.responseInterceptors.forEach(interceptor => {
      bluebirdPromise = bluebirdPromise.then(interceptor.response.bind(interceptor));
    });

    return bluebirdPromise;
  }

  get url() {
    return this.urlBuilder.build();
  }

}

function toJsonBlob(body) {
  let json = Object.prototype.toString.call(body) === '[object String]' ? body : JSON.stringify(body);
  return new Blob([json], {type: 'application/json'});
}

