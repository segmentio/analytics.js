

describe('User tests', function () {

  var user   = require('analytics/src/user.js')
    , cookie = require('analytics/src/cookie.js')
    , json   = require('segmentio-json');

  describe('#id()', function () {
    before(user.clear);

    it('gets an empty user id', function () {
      var id = user.id();
      expect(id).to.eql(null);
    });

    it('gets the updated user id', function () {
      user.update('someId', { some : 'trait' });
      var id = user.id();
      expect(id).to.eql('someId');
    });
  });

  describe('#traits()', function () {
    before(user.clear);

    it('gets empty traits', function () {
      var traits = user.traits();
      expect(traits).to.eql({});
    });

    it('gets updated traits', function () {
      user.update(null, { a : 'trait' });
      var traits = user.traits();
      expect(traits).to.eql({ a : 'trait' });
    });
  });

  describe('#update()', function () {
    before(user.clear);

    it('saves a stored user', function () {
      var alias  = user.update('someId')
        , id     = user.id()
        , traits = user.traits();
      expect(alias).to.be.ok();
      expect(id).to.be('someId');
      expect(traits).to.eql({});
    });

    it('updates the users traits', function () {
      var alias  = user.update(null, { some : 'trait' })
        , id     = user.id()
        , traits = user.traits();
      expect(alias).to.not.be.ok();
      expect(id).to.be('someId');
      expect(traits).to.eql({ some : 'trait' });
    });

    it('assigns new traits for a new user', function () {
      var alias  = user.update('newId', { other : 'trait' })
        , id     = user.id()
        , traits = user.traits();
      expect(alias).to.not.be.ok();
      expect(id).to.be('newId');
      expect(traits).to.eql({ other : 'trait' });
    });

    it('extends traits for the same user', function () {
      var alias  = user.update('newId', { cats : 6 })
        , id     = user.id()
        , traits = user.traits();
      expect(alias).to.not.be.ok();
      expect(id).to.be('newId');
      expect(traits).to.eql({ other : 'trait', cats : 6 });
    });

    it('resets traits for a new user', function () {
      var alias  = user.update('thirdId')
        , id     = user.id()
        , traits = user.traits();
      expect(alias).to.not.be.ok();
      expect(id).to.be('thirdId');
      expect(traits).to.eql({});
    });

    it('saves logged out traits', function () {
      user.clear();
      var alias  = user.update(null, { name : 'dog' })
        , id     = user.id()
        , traits = user.traits();
      expect(alias).to.not.be.ok();
      expect(id).to.be(null);
      expect(traits).to.eql({ name : 'dog' });
    });
  });

  describe('#load()', function () {

    var clone = require('component-clone');

    before(user.clear);

    it('loads an empty user', function () {
      var stored = user.load();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });
    });

    it('loads id properly from the cookie', function () {
      user.update('newId', { dog : 'dog' });
      var stored = user.load();
      expect(stored).to.eql({
        id : 'newId',
        traits : { dog : 'dog' }
      });

      var cookieStr = cookie.get(user.cookie().key);
      user.clear();
      cookie.set(user.cookie().key, cookieStr);
      stored = user.load();
      expect(stored).to.eql({
        id : 'newId',
        traits : {}
      });
    });

    it('loads from an old cookie', function () {
      user.clear();
      var oldUser = {
        id     : 'oldId',
        traits : { cat : 'dog' }
      };
      cookie.set(user.cookie().oldKey, oldUser);
      user.load();
      expect(user.id()).to.eql(oldUser.id);
      expect(user.traits()).to.eql(oldUser.traits);
    });
  });

  describe('#clear()', function () {

    it('clears the cookie and user', function () {
      user.load();
      user.clear();
      expect(user.id()).to.be(null);
      expect(user.traits()).to.eql({});
      expect(user.load()).to.eql({ id : null, traits : {}});
      expect(cookie.get(user.cookie().key)).to.be(null);
    });
  });


  describe('#options()', function () {

    it('properly saves the options', function () {
      user.options({
        cookie : {
          key : 'new_key'
        },
        localStorage : {
          key : 'x'
        }
      });

      expect(user.localStorage()).to.eql({ key : 'x' });
      expect(user.cookie()).to.eql({ key : 'new_key', oldKey : 'ajs_user' });
      expect(user.persist).to.be(true);
    });


    it('doesn\'t use the storage if persist === false', function () {
      user.clear();
      user.options({ persist : false });
      var stored = user.load();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });

      user.update('myId', { trait : 4 });
      expect(user.id()).to.be('myId');
      expect(user.traits()).to.eql({ trait: 4 });
      expect(cookie.get(user.cookie().key)).to.be(null);
    });
  });
});
