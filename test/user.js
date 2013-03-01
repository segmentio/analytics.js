

describe('User tests', function () {

  var user = require('analytics/src/user.js');

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
  });

  describe('#load()', function () {
  });
});



