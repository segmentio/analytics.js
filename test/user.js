

describe('User tests', function () {

  var user   = require('analytics/src/user.js')
    , cookie = require('component-cookie');

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
    before(user.clear);

    it('loads an empty user', function () {
      var stored = user.load();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });
    });

    it('loads properly from the cookie', function () {
      user.update('newId', { dog : 'dog' });
      var stored = user.load();
      expect(stored).to.eql({
        id : 'newId',
        traits : { dog : 'dog' }
      });

      var cookieStr = cookie(user.cookie.name);
      user.clear();
      cookie(user.cookie.name, cookieStr, clone(user.cookie));
      stored = user.load();
      expect(stored).to.eql({
        id : 'newId',
        traits : { dog : 'dog' }
      });
    });
  });

  describe('#clear()', function () {

    it('clears the cookie and user', function () {
      user.load();
      user.clear();
      expect(user.id()).to.be(null);
      expect(user.traits()).to.eql({});
      expect(user.load()).to.eql({ id : null, traits : {}});
      expect(cookie(user.cookie.name)).to.be(undefined);
    });
  });


  describe('#options()', function () {

    it('sets cookie options', function () {
      user.options({ cookie : false });
      expect(user.cookie.enabled).to.be(false);

      user.options({ cookie : {
                      name   : 'test_cookie',
                      maxage : 123,
                      path   : '/test',
                      domain : 'segment.io'
                   }});
      expect(user.cookie.name).to.be('test_cookie');
      expect(user.cookie.enabled).to.be(true);
      expect(user.cookie.maxage).to.be(123);
      expect(user.cookie.path).to.be('/test');
      expect(user.cookie.domain).to.be('.segment.io');
    });

    it('doesn\'t use the cookie if cookie === false', function () {
      user.clear();
      user.options({ cookie : false });
      var stored = user.load();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });

      user.update('myId', { trait : 4 });
      expect(user.id()).to.be('myId');
      expect(user.traits()).to.eql({ trait: 4 });
      expect(cookie(user.cookie.name)).to.be(undefined);
    });
  });
});
