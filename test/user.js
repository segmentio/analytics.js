

describe('User tests', function () {

  var user   = require('analytics/src/user.js')
    , cookie = require('component-cookie');

  describe('#get()', function () {

    before(user.clear);

    it('gets an empty user', function () {
      var stored = user.get();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });
    });

    it('gets the updated user', function () {
      user.update('someId', { some : 'trait' });
      var stored = user.get();
      expect(stored).to.eql({
        id     :'someId',
        traits : { some : 'trait' }
      });
    });
  });

  describe('#update()', function () {

    before(user.clear);

    it('saves a stored user', function () {
      user.update('someId');
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'someId',
        traits : {}
      });
    });

    it('updates the user\'s traits', function () {
      user.update(null, { some : 'trait' });
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'someId',
        traits : { some : 'trait' }
      });
    });

    it('assigns new traits for a new user', function () {
      user.update('newId', { other : 'trait' });
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'newId',
        traits : { other : 'trait' }
      });
    });

    it('extends traits for the same user', function () {
      user.update('newId', { cats : 6 });
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'newId',
        traits : { other : 'trait', cats : 6 }
      });
    });

    it('resets traits for a new user', function () {
      user.update('thirdId');
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'thirdId',
        traits : {}
      });
    });

    it('saves logged out traits', function () {
      user.clear();
      user.update(null, { name : 'dog' });
      var stored = user.get();
      expect(stored).to.eql({
        id     : null,
        traits : { name : 'dog' }
      });
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
      cookie(user.cookie.name, cookieStr);
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
      expect(user.get()).to.eql({ id : null, traits : {}});
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
                      maxage : 123
                   }});
      expect(user.cookie.name).to.be('test_cookie');
      expect(user.cookie.enabled).to.be(true);
      expect(user.cookie.maxage).to.be(123);
    });

    it('doesn\'t use the cookie if cookie === false', function () {
      user.options({ cookie : false });
      user.clear();
      var stored = user.load();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });

      user.update('myId', { trait : 4 });
      expect(user.get()).to.eql({
        id : 'myId',
        traits : { trait : 4 }
      });

      expect(cookie(user.cookie.name)).to.be(undefined);
    });
  });
});



