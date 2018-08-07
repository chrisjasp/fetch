# ctjs-fetch
A small fetch library for the browser with built in JWT support written in ES6.

## Getting Started
Install ctjs-fetch
```
npm install --save ctjs-fetch
```

Each send() request returns a Promise with the Response object as the resolved value.
```javascript
import{FetchClient} from 'ctjs-fetch';

let client = new FetchClient(baseUrl);

client.get('path').send()
  .then(response => {
    // Do something with the response
  });

client.get('path').query({}).send()
  .then(response => {
    // Do something with the response
  });

client.post('path').jsonBody({}).send()
  .then(response => {
    // Do something with the response
  });

client.post('path').body(FormData).send()
  .then(response => {
    // Do something with the response
  });

client.put('path').jsonBody({}).send()
  .then(response => {
    // Do something with the response
  });

client.delete('path').send()
  .then(response => {
    // Do something with the response
  });
```

## Authentication
There is an Auth class to help with JWT using local storage. You can store, remove, verify, and read the token that 
is returned from your API login.
```javascript
import {Auth} from 'ctjs-fetch';

let config = {
  tokenName: "<Token name. Default: token>",
  authToken: "<Bearer Name. Default: Token>",
  storageType: "<Storage Type. Default: LocalStorage>",
  authHeader: "<Request Header. Default: Authorization>",
};

let auth = new Auth(config);
// returns bool
auth.isAuthenticated();
// stores the resulting jwt token
auth.loginSuccess(token);
// destroy the stored token
auth.logout();
```
## Interceptors
Interceptors provide a way to modify the request or response. The most common Interceptor is the 
AddAuthHeader. Some others are 
* AddAuthHeader
* AcceptJson
* ReadJson
* ThrowOnErrorResponse
* WorkingOverlay
```javascript
import {Auth, AddAuthHeader, FetchClient} from 'ctjs-fetch';

let config = {};
let auth = new Auth(config);

let fetchClient = new FetchClient(baseUrl).withInterceptor(new AddAuthHeader(auth));
```

### Who do I talk to?
chrisjasp@gmail.com