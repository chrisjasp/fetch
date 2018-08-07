(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("bluebird"));
	else if(typeof define === 'function' && define.amd)
		define(["bluebird"], factory);
	else if(typeof exports === 'object')
		exports["ctjs-fetch"] = factory(require("bluebird"));
	else
		root["ctjs-fetch"] = factory(root["bluebird"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorMessage = exports.ErrorResponse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ctjsUtil = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ErrorResponse = exports.ErrorResponse = function () {
  _createClass(ErrorResponse, null, [{
    key: 'empty',
    value: function empty() {
      return new ErrorResponse();
    }
  }, {
    key: 'buildAndThrow',
    value: function buildAndThrow(obj) {
      return ErrorResponse.build(obj).then(function (r) {
        throw r;
      });
    }
  }, {
    key: 'build',
    value: function build(obj) {
      obj = obj != null ? obj : 'Null argument given to ErrorResponse';
      if (obj instanceof ErrorResponse) {
        // We already have an ErrorResponse
        return Promise.resolve(obj);
      } else if (obj.status !== undefined && obj.statusText !== undefined && obj.headers !== undefined) {
        // Looks like a fetch response
        return ErrorResponse.buildFromFetch(obj);
      } else if (obj instanceof TypeError) {
        // Native fetch returns TypeError for network errors
        return ErrorResponse.buildFromTypeError(obj);
      } else if (_ctjsUtil.Util.isError(obj)) {
        // Treat it like an error
        return ErrorResponse.buildFromError(obj);
      } else {
        // Handle everything else text
        return ErrorResponse.buildFromText(obj.toString());
      }
    }
  }, {
    key: 'buildFromTypeError',
    value: function buildFromTypeError(te) {
      var er = new ErrorResponse();
      er.status = 0;
      er.statusText = te.message;
      er.message = 'Networking Error. ' + te.message + '.';
      er.errorMessages = [te.message];
      er.stack = te.stack;
      return Promise.resolve(er);
    }
  }, {
    key: 'buildFromFetch',
    value: function buildFromFetch(r) {
      var er = new ErrorResponse();
      er.status = r.status;
      er.statusText = r.statusText;

      var contentType = r.headers.get('content-type');
      if (contentType && contentType.indexOf('vnd+netfile.error+json') !== -1) {
        // Should match our specific error type structure.
        return r.json().then(function (data) {
          er.data = data;
          er.errorMessages = Array.from(data.errorMessages ? data.errorMessages : [], function (i) {
            return new ErrorMessage(i);
          });
          er.message = Array.from(er.errorMessages, function (m) {
            return m.message;
          }).join(', ');
          return er;
        });
      } else if (contentType && contentType.indexOf('json') !== -1) {
        // Unknown json structure.
        return r.json().then(function (data) {
          er.data = data;
          var message = new ErrorMessage({ message: _ctjsUtil.Util.toJson(data) });
          er.errorMessages = [message];
          er.message = message.errorMessages;
          return er;
        });
      } else {
        // Just assume it's text.
        return r.text().then(function (data) {
          er.data = data;
          var message = new ErrorMessage({ message: data });
          er.errorMessages = [message];
          er.message = data;
          return er;
        });
      }
    }
  }, {
    key: 'buildFromError',
    value: function buildFromError(e) {
      return ErrorResponse.buildFromText(e.toString());
    }
  }, {
    key: 'buildFromText',
    value: function buildFromText(text) {
      var er = new ErrorResponse();
      er.message = text;
      var message = new ErrorMessage();
      message.message = text;
      er.messages = [message];
      return Promise.resolve(er);
    }
  }]);

  function ErrorResponse() {
    _classCallCheck(this, ErrorResponse);

    this.status = null;
    this.message = null;
    this.statusText = null;
    this.data = null;
    this.exceptionType = null;
    this.stackTrace = null;
    this.errorMessages = [];
  }

  _createClass(ErrorResponse, [{
    key: 'findMessageByPropertyName',
    value: function findMessageByPropertyName(propertyName) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.errorMessages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var message = _step.value;

          if (message.propertyName != null && propertyName === message.propertyName.toLowerCase()) {
            return message;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'empty',
    get: function get() {
      return this.text === null && this.status === null && this.messages.length === 0;
    }
  }, {
    key: 'notEmpty',
    get: function get() {
      return this.text != null || this.status != null || this.messages.length > 0;
    }
  }]);

  return ErrorResponse;
}();

var ErrorMessage = exports.ErrorMessage = function () {
  function ErrorMessage(d) {
    _classCallCheck(this, ErrorMessage);

    this.build(d);
  }

  _createClass(ErrorMessage, [{
    key: 'build',
    value: function build(data) {
      data = data != null ? data : {};
      this.message = data.message;
      this.errorCode = data.errorCode;
      this.propertyName = data.propertyName;
    }
  }]);

  return ErrorMessage;
}();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__enum__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Enum", function() { return __WEBPACK_IMPORTED_MODULE_0__enum__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__options__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Option", function() { return __WEBPACK_IMPORTED_MODULE_1__options__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Options", function() { return __WEBPACK_IMPORTED_MODULE_1__options__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__url_builder__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UrlBuilder", function() { return __WEBPACK_IMPORTED_MODULE_2__url_builder__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return __WEBPACK_IMPORTED_MODULE_3__util__["a"]; });






/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkingOverlay = exports.ThrowOnErrorResponse = exports.ReadJson = exports.AcceptJson = exports.AddAuthHeader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errorResponse = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddAuthHeader = function () {
  function AddAuthHeader(auth) {
    _classCallCheck(this, AddAuthHeader);

    this.auth = auth;
  }

  _createClass(AddAuthHeader, [{
    key: 'request',
    value: function request(_request) {
      if (this.auth.isAuthenticated()) {
        var token = this.auth.readToken();
        _request.headers.append(this.auth.authHeader, token);
      }
      return _request;
    }
  }]);

  return AddAuthHeader;
}();

exports.AddAuthHeader = AddAuthHeader;

var AcceptJson = function () {
  function AcceptJson() {
    _classCallCheck(this, AcceptJson);
  }

  _createClass(AcceptJson, [{
    key: 'request',
    value: function request(_request2) {
      _request2.headers.append('Accept', 'application/json');
      return _request2;
    }
  }]);

  return AcceptJson;
}();

exports.AcceptJson = AcceptJson;

var ReadJson = function () {
  function ReadJson() {
    _classCallCheck(this, ReadJson);
  }

  _createClass(ReadJson, [{
    key: 'response',
    value: function response(_response) {
      var contentType = _response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return _response.json();
      } else {
        return _response;
      }
    }
  }]);

  return ReadJson;
}();

exports.ReadJson = ReadJson;

var ThrowOnErrorResponse = function () {
  function ThrowOnErrorResponse() {
    _classCallCheck(this, ThrowOnErrorResponse);
  }

  _createClass(ThrowOnErrorResponse, [{
    key: 'response',
    value: function response(_response2) {
      if (!_response2.ok) {
        return _errorResponse.ErrorResponse.buildAndThrow(_response2);
      } else {
        return _response2;
      }
    }
  }]);

  return ThrowOnErrorResponse;
}();

exports.ThrowOnErrorResponse = ThrowOnErrorResponse;

var WorkingOverlay = function () {
  function WorkingOverlay() {
    _classCallCheck(this, WorkingOverlay);

    this.callCount = 0;
  }

  _createClass(WorkingOverlay, [{
    key: 'request',
    value: function request(_request3) {
      this.callCount++;
      $('body').addClass('working');
      return _request3;
    }
  }, {
    key: 'response',
    value: function response(_response3) {
      this.callCount--;
      if (this.callCount < 1) {
        $('body').removeClass('working');
      }
      return _response3;
    }
  }]);

  return WorkingOverlay;
}();

exports.WorkingOverlay = WorkingOverlay;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Auth = exports.AuthStorageType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = __webpack_require__(3);

var _ctjsUtil = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthStorageType = exports.AuthStorageType = new _ctjsUtil.Enum({
  LOCAL: null,
  SESSION: null
});

var Auth = exports.Auth = function () {
  function Auth(config) {
    _classCallCheck(this, Auth);

    config = config != null ? config : {};
    this.tokenName = config.tokenName ? config.tokenName : 'token';
    this.authToken = config.authToken ? config.authToken : 'Token';
    this.storageType = config.storageType ? config.storageType : AuthStorageType.LOCAL;
    this.authHeader = config.authHeader ? config.authHeader : 'Authorization';
    this.storage = new AuthStorage(this.storageType);

    Object.freeze(this);
  }

  _createClass(Auth, [{
    key: 'isAuthenticated',
    value: function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      // There's no token, so user is not authenticated.
      if (!token) {
        return false;
      }

      // There is a token, but in a different format. Return true.
      if (token.split('.').length !== 3) {
        return true;
      }

      var exp = void 0;
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        exp = JSON.parse(window.atob(base64)).exp;
      } catch (error) {
        return false;
      }

      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }
      return true;
    }
  }, {
    key: 'loginSuccess',
    value: function loginSuccess(token) {
      this.storage.set(this.tokenName, token);
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this = this;

      return new _bluebird.Promise(function (resolve) {
        _this.storage.remove(_this.tokenName);
        resolve();
      });
    }
  }, {
    key: 'readToken',
    value: function readToken() {
      var token = this.storage.get(this.tokenName);

      if (this.authHeader && this.authToken) {
        token = this.authToken + ' ' + token;
      }
      return token;
    }
  }]);

  return Auth;
}();

var AuthStorage = function () {
  function AuthStorage(storageType) {
    _classCallCheck(this, AuthStorage);

    this.storageType = storageType;
  }

  _createClass(AuthStorage, [{
    key: 'get',
    value: function get(key) {
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
  }, {
    key: 'set',
    value: function set(key, value) {
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
  }, {
    key: 'remove',
    value: function remove(key) {
      switch (this.storageType) {
        case AuthStorageType.LOCAL:
          if ('localStorage' in window && window['localStorage'] != null) {
            return localStorage.removeItem(key);
          } else {
            console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.'); // eslint-disable-line no-console
            return undefined;
          }
          break;

        case AuthStorageType.SESSION:
          if ('sessionStorage' in window && window['sessionStorage'] != null) {
            return sessionStorage.removeItem(key);
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
  }]);

  return AuthStorage;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AjaxRequest = exports.FetchClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ctjsUtil = __webpack_require__(1);

var _bluebird = __webpack_require__(3);

var _errorResponse = __webpack_require__(0);

var _fetchInterceptors = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetchClient = exports.FetchClient = function () {
  function FetchClient(baseUrl) {
    _classCallCheck(this, FetchClient);

    this.baseUrl = baseUrl;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  _createClass(FetchClient, [{
    key: 'addInterceptor',
    value: function addInterceptor(interceptor) {
      if (_ctjsUtil.Util.isFunction(interceptor.request)) {
        this.requestInterceptors.push(interceptor);
      }
      if (_ctjsUtil.Util.isFunction(interceptor.response)) {
        this.responseInterceptors.push(interceptor);
      }
    }
  }, {
    key: 'buildUrl',
    value: function buildUrl() {
      for (var _len = arguments.length, pathArgs = Array(_len), _key = 0; _key < _len; _key++) {
        pathArgs[_key] = arguments[_key];
      }

      return new _ctjsUtil.UrlBuilder(this.baseUrl).path(pathArgs).build();
    }
  }, {
    key: 'get',
    value: function get() {
      for (var _len2 = arguments.length, pathArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        pathArgs[_key2] = arguments[_key2];
      }

      return new AjaxRequest(this, 'GET', pathArgs);
    }
  }, {
    key: 'post',
    value: function post() {
      for (var _len3 = arguments.length, pathArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        pathArgs[_key3] = arguments[_key3];
      }

      return new AjaxRequest(this, 'POST', pathArgs);
    }
  }, {
    key: 'put',
    value: function put() {
      for (var _len4 = arguments.length, pathArgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        pathArgs[_key4] = arguments[_key4];
      }

      return new AjaxRequest(this, 'PUT', pathArgs);
    }
  }, {
    key: 'delete',
    value: function _delete() {
      for (var _len5 = arguments.length, pathArgs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        pathArgs[_key5] = arguments[_key5];
      }

      return new AjaxRequest(this, 'DELETE', pathArgs);
    }
  }]);

  return FetchClient;
}();

var AjaxRequest = function () {
  function AjaxRequest(fetchClient, method, pathArgs) {
    _classCallCheck(this, AjaxRequest);

    this.urlBuilder = new _ctjsUtil.UrlBuilder(fetchClient.baseUrl);
    if (pathArgs) {
      this.urlBuilder.path(pathArgs);
    }
    this._method = method;
    this._body = null;
    this.headers = new Headers();
    this.requestInterceptors = fetchClient.requestInterceptors.slice();
    this.responseInterceptors = fetchClient.responseInterceptors.slice();
  }

  _createClass(AjaxRequest, [{
    key: 'withInterceptor',
    value: function withInterceptor(interceptor) {
      if (_ctjsUtil.Util.isFunction(interceptor.request)) {
        this.requestInterceptors.push(interceptor);
      }
      if (_ctjsUtil.Util.isFunction(interceptor.response)) {
        this.responseInterceptors.push(interceptor);
      }
      return this;
    }
  }, {
    key: 'path',
    value: function path() {
      for (var _len6 = arguments.length, pathArgs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        pathArgs[_key6] = arguments[_key6];
      }

      this.urlBuilder.path(pathArgs);
      return this;
    }
  }, {
    key: 'query',
    value: function query(_query) {
      this.urlBuilder.query(_query);
      return this;
    }
  }, {
    key: 'body',
    value: function body(_body) {
      this._body = _body;
      return this;
    }
  }, {
    key: 'jsonBody',
    value: function jsonBody(_jsonBody) {
      if (!this.headers.has('Content-Type')) {
        this.headers.append('Content-Type', 'application/json');
      }
      this._body = toJsonBlob(_jsonBody);
      return this;
    }
  }, {
    key: 'send',
    value: function send() {
      var _this = this;

      // Apply request interceptors.
      this.requestInterceptors.forEach(function (interceptor) {
        interceptor.request(_this);
      });

      // Perform the fetch (returns a promise)
      var config = {
        method: this._method,
        headers: this.headers
      };
      if (this._body) {
        config.body = this._body;
      }
      var p = fetch(this.url, config).catch(function (e) {
        var overlay = _this.responseInterceptors.find(function (t) {
          return t instanceof _fetchInterceptors.WorkingOverlay;
        });
        overlay.response();
        localStorage.clear();
        sessionStorage.clear();
        return _errorResponse.ErrorResponse.build(e);
      });

      // Convert to a bluebird promise.
      var bluebirdPromise = _bluebird.Promise.resolve(p);

      // Apply response interceptors
      this.responseInterceptors.forEach(function (interceptor) {
        bluebirdPromise = bluebirdPromise.then(interceptor.response.bind(interceptor));
      });

      return bluebirdPromise;
    }
  }, {
    key: 'url',
    get: function get() {
      return this.urlBuilder.build();
    }
  }]);

  return AjaxRequest;
}();

exports.AjaxRequest = AjaxRequest;


function toJsonBlob(body) {
  var json = Object.prototype.toString.call(body) === '[object String]' ? body : JSON.stringify(body);
  return new Blob([json], { type: 'application/json' });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchInterceptors = __webpack_require__(2);

Object.defineProperty(exports, 'AddAuthHeader', {
  enumerable: true,
  get: function get() {
    return _fetchInterceptors.AddAuthHeader;
  }
});
Object.defineProperty(exports, 'AcceptJson', {
  enumerable: true,
  get: function get() {
    return _fetchInterceptors.AcceptJson;
  }
});
Object.defineProperty(exports, 'ReadJson', {
  enumerable: true,
  get: function get() {
    return _fetchInterceptors.ReadJson;
  }
});
Object.defineProperty(exports, 'ThrowOnErrorResponse', {
  enumerable: true,
  get: function get() {
    return _fetchInterceptors.ThrowOnErrorResponse;
  }
});
Object.defineProperty(exports, 'WorkingOverlay', {
  enumerable: true,
  get: function get() {
    return _fetchInterceptors.WorkingOverlay;
  }
});

var _errorResponse = __webpack_require__(0);

Object.defineProperty(exports, 'ErrorResponse', {
  enumerable: true,
  get: function get() {
    return _errorResponse.ErrorResponse;
  }
});
Object.defineProperty(exports, 'ErrorMessage', {
  enumerable: true,
  get: function get() {
    return _errorResponse.ErrorMessage;
  }
});

var _fetchClient = __webpack_require__(5);

Object.defineProperty(exports, 'FetchClient', {
  enumerable: true,
  get: function get() {
    return _fetchClient.FetchClient;
  }
});
Object.defineProperty(exports, 'AjaxRequest', {
  enumerable: true,
  get: function get() {
    return _fetchClient.AjaxRequest;
  }
});

var _auth = __webpack_require__(4);

Object.defineProperty(exports, 'Auth', {
  enumerable: true,
  get: function get() {
    return _auth.Auth;
  }
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Enum {
  constructor(init) {
    this._entries = [];
    if (Object.is(init, undefined) || Object.is(init, null)) {
      throw new Error('ConstMap init is not defined');
    } else {
      for (let key in init) {
        if (init.hasOwnProperty(key)) {
          let value = init[key];
          value = (value !== null && value !== undefined) ? value : key;
          this[key] = value;
          this._entries.push({key: key, value: value});
        }
      }
    }
    Object.freeze(this);
    Object.freeze(this._entries);
  }

  keys() {
    return Array.from(this._entries, e => e.keys);
  }
  values() {
    return Array.from(this._entries, e => e.value);
  }
  valuesExcluding(exclude) {
    return Array.from(this.entriesExcluding(exclude), e => e.value);
  }
  entries() {
    return this._entries.slice();
  }
  entriesExcluding(exclude) {
    if (exclude === null || exclude === undefined) {
      return this._entries;
    }
    let found = [];
    if (Array.isArray(exclude)) {
      for (let e of this._entries) {
        if (!exclude.includes(e.value)) {
          found.push(e.value);
        }
      }
    } else {
      for (let e of this._entries) {
        if (e.value !== exclude) {
          found.push(e.value);
        }
      }
    }
    return found;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Enum;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Option {
  constructor(key, init) {
    if (Object.is(key, undefined)) {
      throw Error('Option key is undefined');
    }
    this.key = key;
    if (typeof init === 'string' || init instanceof String) {
      this.title = init;
      this.value = key;
    } else {
      init = init === null || init === undefined ? {} : init;
      this.title = !Object.is(init.title, undefined) ? init.title : key;
      this.value = !Object.is(init.value, undefined) ? init.value : key;
    }
    Object.freeze(this);
  }
  toString() {
    return this.title;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Option;


class Options {
  constructor(optionsInit) {
    this._all = [];
    this._keys = [];
    if (Object.is(optionsInit, undefined)) {
      throw new Error('Options init is null');
    } else if (Array.isArray(optionsInit)) {
      for (let key of optionsInit) {
        let option = new Option(key);
        this[key] = option;
        this._all.push(option);
        this._keys.push(key);
      }
    } else {
      for (let key in optionsInit) {
        if (optionsInit.hasOwnProperty(key)) {
          let init = optionsInit[key];
          let option = new Option(key, init);
          this[key] = option;
          this._all.push(option);
          this._keys.push(key);
        }
      }
    }
    Object.freeze(this);
    Object.freeze(this._all);
    Object.freeze(this._keys);
  }
  list() {
    return this._all.slice();
  }
  listExcluding(exclude) {
    if (exclude === null || exclude === undefined) {
      return this._all;
    }
    let found = [];
    if (Array.isArray(exclude)) {
      for (let o of this._all) {
        if (!exclude.includes(o)) {
          found.push(o);
        }
      }
    } else {
      for (let o of this._all) {
        if (o !== exclude) {
          found.push(o);
        }
      }
    }
    return found;
  }
  keys() {
    return this._keys.slice();
  }
  forKey(key, ifUndefined) {
    let option = this[key];
    if (option === undefined) {
      return ifUndefined !== undefined ? ifUndefined : null;
    }
    return option;
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Options;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class UrlBuilder {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this._paths = [];
    this._queryParams = [];
  }

  get baseUrl() {
    return this._baseUrl;
  }

  set baseUrl(baseUrl) {
    this._baseUrl = baseUrl != null ? baseUrl : '';
    // Remove leading/trailing spaces and trailing /'s (except when we only have a /)
    if (this._baseUrl !== '/') {
      this._baseUrl = baseUrl != null ? baseUrl.replace(/^\s+|\/+$|\s+$/g, '') : '';
    }
    return this;
  }

  path(... pathsArg) {
    if (pathsArg === null || pathsArg === undefined || pathsArg.length === 0) {
      throw new Error('Attempting to add empty set of sub paths to UrlBuilder');
    } else if (pathsArg.length === 1 && Object.prototype.toString.call(pathsArg[0]) === '[object Array]') {
      // If the argument itself is an array
      pathsArg = pathsArg[0];
    }

    pathsArg.forEach((path) => {
      if (path === null || path === undefined || path.length === 0) {
        throw new Error('Null sub path provided to UrlBuilder, path so far: ' + this._paths.join('/'));
      }
      // Remove any leading/trailing spaces or /'s
      path = path.toString().replace(/^\/+|^\s+|\/+$|\s+$/g, '');
      if (path === 0) {
        throw new Error('Empty sub path provided to UrlBuilder.');
      }
      this._paths.push(path);
    });
    return this;
  }

  query(query) {
    if (query) {
      for (let key in query) {
        if (query.hasOwnProperty(key)) {
          let value = query[key];
          if (value != null) {
            this._queryParams.push({key: key, value: value});
          }
        }
      }
    }
  }

  build() {
    // Use first path element as our base.
    let url = this._baseUrl;
    this._paths.forEach((subPath) => {
      url += '/' + subPath;
    });

    if (this._queryParams.length > 0) {
      let query = '';
      this._queryParams.forEach((queryParam) => {
        query += `${queryParam.key}=${queryParam.value}&`;
      });
      url += '?' + query.substring(0, query.length-1); // Removes last &
    }
    return url;
  }

  clear() {
    this._baseUrl = '';
    this._paths = [];
    this._queryParams = [];
    return this;
  }

  clearPath() {
    this._paths = [];
    return this;
  }

  clearParams() {
    this._queryParams = [];
    return this;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UrlBuilder;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Util {
  static startsWith(value, prefix) {
    let str;
    if (!value || !prefix) {
      return false;
    }
    str = value.toString();
    return str.toString().indexOf(prefix) !== -1;
  }

  static endsWith(value, suffix) {
    let str;
    if (!value || !suffix) {
      return false;
    }
    str = value.toString();
    return str.toString().indexOf(suffix, str.length - suffix.length) !== -1;
  }

  static removeTrailing(value, remove) {
    if (!value || !remove) {
      return value;
    }
    let hasTrailing = value.indexOf(remove, value.length - remove.length) !== -1;
    if (hasTrailing) {
      value = value.substring(0, value.length - remove.length);
    }
    return value;
  }

  static type(object) {
    return Object.prototype.toString.call(object);
  }

  static className(object) {
    return object != null ? object.constructor.name : null;
  }

  static isUndefined(obj) {
    return typeof obj === 'undefined';
  }

  static isUserDefinedObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  static isString(value) {
    return typeof value === 'string';
  }
  static isObject(value) {
    return value != null && typeof value === 'object';
  }
  static isFunction(value) {
    return typeof value === 'function';
  }
  static isArray(array) {
    return Array.isArray(array);
  }

  static isError(obj) {
    return obj instanceof Error;
  }

  static isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
  }

  static toJson(obj) {
    return JSON.stringify(obj);
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Util;



/***/ })
/******/ ]);
});