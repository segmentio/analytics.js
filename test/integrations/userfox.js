
describe('userfox', function () {

  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var Userfox = require('analytics/lib/integrations/userfox');
  var when = require('when');

  var userfox;
  var settings = {
    clientId: '4v2erxr9c5vzqsy35z9gnk6az'
  };

  beforeEach(function () {
    userfox = new Userfox(settings);
    userfox.initialize(); // noop
  });

  afterEach(function () {
    userfox.reset();
  });

  it('should store the right settings', function () {
    test(userfox)
      .name('userfox')
      .assumesPageview()
      .global('_ufq')
      .option('clientId', '');
  });

  describe('#initialize', function () {
    it('should create window._ufq', function () {
      assert(!window._ufq);
      userfox.initialize();
      assert(window._ufq instanceof Array);
    });

    it('should call #load', function () {
      userfox.load = sinon.spy();
      userfox.initialize();
      assert(userfox.load.called);
    });
  });

  describe('#load', function () {
    it('should replace window._ufq.push', function (done) {
      assert(!window._ufq);
      userfox.load();
      when(function () {
        return window._ufq && window._ufq.push !== Array.prototype.push;
      }, done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      userfox.initialize();
      window._ufq.push = sinon.spy();
    });

    it('should initialize the library with an email', function () {
      userfox.identify('id', { email: 'name@example.com' });
      assert(window._ufq.push.calledWith(['init', {
        clientId: settings.clientId,
        email: 'name@example.com'
      }]));
    });

    it('should send traits', function () {
      userfox.identify(null, { email: 'name@example.com', trait: true });
      assert(window._ufq.push.calledWith(['track', {
        email: 'name@example.com',
        trait: true
      }]));
    });

    it('should convert dates to a format userfox supports', function () {
      var date = new Date();
      userfox.identify(null, {
        email: 'name@example.com',
        date: date
      });
      assert(window._ufq.push.calledWith(['track', {
        email: 'name@example.com',
        date: Math.round(date.getTime() / 1000).toString()
      }]));
    });

    it('should alias a created trait to signup_date', function () {
      var date = new Date();
      userfox.identify(null, {
        email: 'name@example.com',
        created: date
      });
      assert(window._ufq.push.calledWith(['track', {
        email: 'name@example.com',
        signup_date: Math.round(date.getTime() / 1000).toString()
      }]));
    });
  });
});