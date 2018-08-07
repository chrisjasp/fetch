import {Util} from 'ctjs-util';

export class ErrorResponse {

  static empty() {
    return new ErrorResponse();
  }

  static buildAndThrow(obj) {
    return ErrorResponse.build(obj)
        .then(r => {
          throw r;
        });
  }

  static build(obj) {
    obj = obj != null ? obj : 'Null argument given to ErrorResponse';
    if (obj instanceof ErrorResponse) {
      // We already have an ErrorResponse
      return Promise.resolve(obj);
    } else if (obj.status !== undefined && obj.statusText !== undefined && obj.headers !== undefined ) {
      // Looks like a fetch response
      return ErrorResponse.buildFromFetch(obj);
    } else if (obj instanceof TypeError) {
      // Native fetch returns TypeError for network errors
      return ErrorResponse.buildFromTypeError(obj);
    } else if (Util.isError(obj)) {
      // Treat it like an error
      return ErrorResponse.buildFromError(obj);
    } else {
      // Handle everything else text
      return ErrorResponse.buildFromText(obj.toString());
    }
  }

  static buildFromTypeError(te) {
    let er = new ErrorResponse();
    er.status = 0;
    er.statusText = te.message;
    er.message = `Networking Error. ${te.message}.`;
    er.errorMessages = [te.message];
    er.stack = te.stack;
    return Promise.resolve(er);
  }

  static buildFromFetch(r) {
    let er = new ErrorResponse();
    er.status = r.status;
    er.statusText = r.statusText;

    let contentType = r.headers.get('content-type');
    if (contentType && contentType.indexOf('vnd+netfile.error+json') !== -1) {
      // Should match our specific error type structure.
      return r.json()
          .then(data => {
            er.data = data;
            er.errorMessages = Array.from(data.errorMessages ? data.errorMessages : [], i => new ErrorMessage(i));
            er.message = Array.from(er.errorMessages, m => m.message).join(', ');
            return er;
          });
    } else if (contentType && contentType.indexOf('json') !== -1) {
      // Unknown json structure.
      return r.json()
          .then(data => {
            er.data = data;
            let message = new ErrorMessage({message: Util.toJson(data)});
            er.errorMessages = [message];
            er.message = message.errorMessages;
            return er;
          });
    } else {
      // Just assume it's text.
      return r.text()
          .then(data => {
            er.data = data;
            let message = new ErrorMessage({message: data});
            er.errorMessages = [message];
            er.message = data;
            return er;
          });
    }
  }

  static buildFromError(e) {
    return ErrorResponse.buildFromText(e.toString());
  }

  static buildFromText(text) {
    let er = new ErrorResponse();
    er.message = text;
    let message = new ErrorMessage();
    message.message = text;
    er.messages = [message];
    return Promise.resolve(er);
  }

  constructor() {
    this.status = null;
    this.message = null;
    this.statusText = null;
    this.data = null;
    this.exceptionType = null;
    this.stackTrace = null;
    this.errorMessages = [];
  }

  get empty() {
    return this.text === null && this.status === null && this.messages.length === 0;
  }

  get notEmpty() {
    return this.text != null || this.status != null || this.messages.length > 0;
  }

  findMessageByPropertyName(propertyName) {
    for (let message of this.errorMessages) {
      if (message.propertyName != null && propertyName === message.propertyName.toLowerCase()) {
        return message;
      }
    }
  }

}

export class ErrorMessage {
  constructor(d) {
    this.build(d);
  }

  build(data) {
    data = (data != null) ? data : {};
    this.message = data.message;
    this.errorCode = data.errorCode;
    this.propertyName = data.propertyName;
  }
}
