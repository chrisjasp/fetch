import assert from 'assert';

import {UrlBuilder} from '../src/url-builder';

describe('Url Builder Tests', () => {
  let baseUrl = "http://example.com";

  it('Basic usage', () => {
    let b = new UrlBuilder(baseUrl);
    b.path("one", "two");
    b.query({"key1": "value1", "key2": "value2"});
    assert.equal(b.build(), `${baseUrl}/one/two?key1=value1&key2=value2`);
  });

  it('Path errors', () => {
    let b = new UrlBuilder(baseUrl);
    assert.throws(() => b.path());
    assert.throws(() => b.path(null));
    assert.throws(() => b.path(''));
    assert.throws(() => b.path(undefined));
    assert.throws(() => b.path('one', null));
    assert.throws(() => b.path('one', ''));
    assert.throws(() => b.path('one', undefined));
  });

  it('Base url is absolute', () => {
    let b = new UrlBuilder(baseUrl);
    assert.equal(b.baseUrl, baseUrl);
    b = new UrlBuilder(baseUrl + "/");
    assert.equal(b.baseUrl, baseUrl);
    b = new UrlBuilder(" " + baseUrl + " ");
    assert.equal(b.baseUrl, baseUrl);
    b = new UrlBuilder(" " + baseUrl + " ");
    assert.equal(b.baseUrl, baseUrl);;
    b = new UrlBuilder("   " + baseUrl + "    ");
    assert.equal(b.baseUrl, baseUrl);
    b = new UrlBuilder(baseUrl + "/");
    assert.equal(b.baseUrl, baseUrl);
    b = new UrlBuilder(baseUrl + "//");
    assert.equal(b.baseUrl, baseUrl);
  });

  it('Base url is a path', () => {
    let basePath = "/somewhere";
    let b = new UrlBuilder(basePath);
    assert.equal(b.baseUrl, basePath);
  });

  it('Null & empty base url become empty string', () => {
    assert.equal(new UrlBuilder().baseUrl, '');
    assert.equal(new UrlBuilder("").baseUrl, '');
    assert.equal(new UrlBuilder("  ").baseUrl, '');
  });
});
