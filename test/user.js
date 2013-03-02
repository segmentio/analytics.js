

describe('User tests', function () {

  var user   = require('analytics/src/user.js')
    , cookie = require('component-cookie');

  describe('#get()', function () {

    before(user.clear);

    it('should get an empty user', function () {
      var stored = user.get();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });
    });

    it('should get the updated user', function () {
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

    it('should save a stored user', function () {
      user.update('someId');
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'someId',
        traits : {}
      });
    });

    it('should update the users traits', function () {
      user.update(null, { some : 'trait' });
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'someId',
        traits : { some : 'trait' }
      });
    });

    it('should assign new traits for a new user', function () {
      user.update('newId', { other : 'trait' });
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'newId',
        traits : { other : 'trait' }
      });
    });

    it('should extend traits for the same user', function () {
      user.update('newId', { cats : 6 });
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'newId',
        traits : { other : 'trait', cats : 6 }
      });
    });

    it('should reset traits for a new user', function () {
      user.update('thirdId');
      var stored = user.get();
      expect(stored).to.eql({
        id     : 'thirdId',
        traits : {}
      });
    });

    it('should save logged out traits', function () {
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

    it('should load an empty user', function () {
      var stored = user.load();
      expect(stored).to.eql({
        id     : null,
        traits : {}
      });
    });

    it('should load properly from the cookie', function () {
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
    it('should clear the cookie and user', function () {
      user.clear();
      expect(user.get()).to.eql({ id : null, traits : {}});
      expect(user.load()).to.eql({ id : null, traits : {}});
      expect(cookie(user.cookie.name)).to.be(undefined);
    });
  });
});



