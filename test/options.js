import assert from 'assert';
import {Options, Option} from '../src/options';

describe('Options Tests', () => {

  it('Color options built correctly', () => {
    assert.equal(ColorOptions.RED.key, 'RED');
    assert.equal(ColorOptions.RED.title, 'RED');
    assert.equal(ColorOptions.RED.value, 'RED');
    assert.equal(ColorOptions.BLUE.key, 'BLUE');
    assert.equal(ColorOptions.BLUE.title, 'BLUE');
    assert.equal(ColorOptions.BLUE.value, 'BLUE');
    assert.equal(ColorOptions.list().length, 3);
    assert.equal(ColorOptions.keys().length, 3);
  });

  it('Pet options built correctly', () => {
    assert.equal(PetOptions.DOG.key, 'DOG');
    assert.equal(PetOptions.DOG.title, 'DOG');
    assert.equal(PetOptions.DOG.value, 'DOG');
    assert.equal(PetOptions.CAT.key, 'CAT');
    assert.equal(PetOptions.CAT.title, 'CAT');
    assert.equal(PetOptions.CAT.value, 'CAT');
    assert.equal(PetOptions.FISH.key, 'FISH');
    assert.equal(PetOptions.FISH.title, 'FISH');
    assert.equal(PetOptions.FISH.value, 'FISH');
    assert.equal(PetOptions.list().length, 3);
    assert.equal(PetOptions.keys().length, 3);
  });

  it('Greeting options built correctly', () => {
    assert.equal(GreetingOptions.HELLO.key, 'HELLO');
    assert.equal(GreetingOptions.HELLO.title, 'Hello');
    assert.equal(GreetingOptions.HELLO.value, 'HELLO');
    assert.equal(GreetingOptions.NONE.key, 'NONE');
    assert.equal(GreetingOptions.NONE.title, '');
    assert.equal(GreetingOptions.NONE.value, null);
    assert.equal(GreetingOptions.list().length, 4);
    assert.equal(GreetingOptions.keys().length, 4);
  });

  it('Greeting options built correctly', () => {
    assert.equal(MuppetOptions.Fozzie.key, 'Fozzie');
    assert.equal(MuppetOptions.Fozzie.title, 'Fozzie');
    assert.equal(MuppetOptions.Fozzie.value.last, 'Bear');
    assert.equal(MuppetOptions.Kermit.key, 'Kermit');
    assert.equal(MuppetOptions.Kermit.title, 'Kermit');
    assert.equal(MuppetOptions.Kermit.value.last, 'Frog');
    assert.equal(MuppetOptions.None.key, 'None');
    assert.equal(MuppetOptions.None.title, '');
    assert.equal(MuppetOptions.None.value, null);
    assert.equal(GreetingOptions.list().length, 4);
    assert.equal(GreetingOptions.keys().length, 4);
  });

  it('Tree options built correctly', () => {
    assert.equal(TreeOptions.SUGAR_PINE.key, 'SUGAR_PINE');
    assert.equal(TreeOptions.SUGAR_PINE.title, 'Sugar Pine');
    assert.equal(TreeOptions.SUGAR_PINE.value, 'SUGAR_PINE');
    assert.equal(TreeOptions.OAK.key, 'OAK');
    assert.equal(TreeOptions.OAK.title, 'Oak');
    assert.equal(TreeOptions.OAK.value, 'OAK');
    assert.equal(TreeOptions.NONE.key, 'NONE');
    assert.equal(TreeOptions.NONE.title, '');
    assert.equal(TreeOptions.NONE.value, null);
    assert.equal(TreeOptions.list().length, 3);
    assert.equal(TreeOptions.keys().length, 3);
  });

  it('For key', () => {
    assert.equal(TreeOptions.forKey("SUGAR_PINE"), TreeOptions.SUGAR_PINE);
    assert.equal(TreeOptions.forKey("junk"), null);
    assert.equal(TreeOptions.forKey(null), null);
    assert.equal(TreeOptions.forKey("junk", TreeOptions.NONE), TreeOptions.NONE);
    assert.equal(TreeOptions.forKey(null, TreeOptions.SUGAR_PINE), TreeOptions.SUGAR_PINE);
  });

  it('List', () => {
    let listed = TreeOptions.list();
    assert.equal(listed.includes(TreeOptions.SUGAR_PINE), true);
    assert.equal(listed.includes(TreeOptions.OAK), true);
    assert.equal(listed.includes(TreeOptions.NONE), true);
  });

  it('Keys', () => {
    let listed = TreeOptions.keys();
    assert.equal(listed.includes(TreeOptions.SUGAR_PINE.key), true);
    assert.equal(listed.includes(TreeOptions.OAK.key), true);
    assert.equal(listed.includes(TreeOptions.NONE.key), true);
  });

  it('List Excluding', () => {
    let listed = TreeOptions.listExcluding();
    assert.equal(listed.includes(TreeOptions.SUGAR_PINE), true);
    assert.equal(listed.includes(TreeOptions.OAK), true);
    assert.equal(listed.includes(TreeOptions.NONE), true);
    listed = TreeOptions.listExcluding(TreeOptions.OAK);
    assert.equal(listed.includes(TreeOptions.SUGAR_PINE), true);
    assert.equal(listed.includes(TreeOptions.OAK), false);
    assert.equal(listed.includes(TreeOptions.NONE), true);
    listed = TreeOptions.listExcluding([TreeOptions.OAK,TreeOptions.NONE]);
    assert.equal(listed.includes(TreeOptions.SUGAR_PINE), true);
    assert.equal(listed.includes(TreeOptions.OAK), false);
    assert.equal(listed.includes(TreeOptions.NONE), false);
  });

  it('Change options fails', () => {
    assert.throws(() => GreetingOptions.JUNK = "ZZZ");
    assert.throws(() => GreetingOptions.HI = "ZZZ");
    assert.throws(() => GreetingOptions._all.push("ZZZ"));
    assert.throws(() => GreetingOptions._keys.push("ZZZ"));
  });

});

const ColorOptions = new Options({
  RED: {},
  BLUE: null,
  GREEN: {}
});

const PetOptions = new Options(["DOG", "CAT", "FISH"]);

const TreeOptions = new Options({
  NONE: {value: null, title: ''},
  SUGAR_PINE: "Sugar Pine",
  OAK: "Oak"
});

const GreetingOptions = new Options({
  NONE: {value: null, title: ''},
  HI: {title: 'Hi'},
  HELLO: {title: 'Hello'},
  HEY: {title: 'Hey'}
});

const MuppetOptions = new Options({
  None: {value: null, title: ''},
  Fozzie: {value: {age: 26, first: "Fozzie", last: "Bear"}},
  Kermit: {value: {age: 26, first: "Kermit", last: "Frog"}}
});
