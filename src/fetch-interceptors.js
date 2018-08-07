import {ErrorResponse} from './error-response';

export class AddAuthHeader {
  constructor(auth) {
    this.auth = auth;
  }
  request(request) {
    if (this.auth.isAuthenticated()) {
      let token = this.auth.readToken();
      request.headers.append(this.auth.authHeader, token);
    }
    return request;
  }
}

export class AcceptJson {
  request(request) {
    request.headers.append('Accept', 'application/json');
    return request;
  }
}

export class ReadJson {
  response(response) {
    let contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    } else {
      return response;
    }
  }
}

export class ThrowOnErrorResponse {
  response(response) {
    if (!response.ok) {
      return ErrorResponse.buildAndThrow(response);
    } else {
      return response;
    }
  }
}

export class WorkingOverlay {
  constructor() {
    this.callCount = 0;
  }
  request(request) {
    this.callCount++;
    $('body').addClass('working');
    return request;
  }
  response(response) {
    this.callCount--;
    if (this.callCount < 1) {
      $('body').removeClass('working');
    }
    return response;
  }
}
