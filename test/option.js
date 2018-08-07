import assert from 'assert';
import {Option} from '../src/options';

describe('Option Tests', () => {
  it('Constructor with no args', () => {
    assert.throws(() => new Option());
  });

  it('Constructor with key arg', () => {
    let option = new Option("key_arg");
    assert.equal(option.key, 'key_arg');
    assert.equal(option.title, 'key_arg');
    assert.equal(option.value, 'key_arg');
  });

  it('Constructor key and title args', () => {
    let option = new Option("key_arg", {title:"title_arg"});
    assert.equal(option.key, 'key_arg');
    assert.equal(option.title, 'title_arg');
    assert.equal(option.value, 'key_arg');
    assert.equal(option.toString(), 'title_arg');
  });

  it('Constructor key, title, value args', () => {
    let option = new Option("key_arg", {title:"title_arg", value:"value_arg"});
    assert.equal(option.key, 'key_arg');
    assert.equal(option.title, 'title_arg');
    assert.equal(option.value, 'value_arg');
  });

  it('Constructor complex value', () => {
    let value = {first : "Fozzie", last : "Bear"};
    let option = new Option("key_arg", {title:"title_arg", value:value});
    assert.equal(option.key, 'key_arg');
    assert.equal(option.title, 'title_arg');
    assert.equal(option.value, value);
  });

  it('Change property throws', () => {
    let option = new Option("key_arg", {title:"title_arg", value:"value_arg"});
    assert.throws(() => option.key = "hello");
    assert.throws(() => option.title = "hello");
    assert.throws(() => option.value = "hello");
    assert.equal(option.key, 'key_arg');
    assert.equal(option.title, 'title_arg');
    assert.equal(option.value, 'value_arg');
  });

});