
describe('Olark', function () {

  var Olark = require('analytics/lib/integrations/olark');
  var assert = require('assert');
  var once = require('once');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var olark;
  var settings = {
    siteId: '5798-949-10-1692'
  };

  function expandThen (fn) {
    window.olark('api.box.onExpand', once(fn));
    window.olark('api.box.expand');
  }

  function shrinkThen (fn) {
    window.olark('api.box.onShrink', once(fn));
    window.olark('api.box.shrink');
  }

  beforeEach(function () {
    olark = new Olark(settings);
    olark.initialize(); // noop
  });

  afterEach(function () {
    var global = window.olark;
    olark.reset();
    window.olark = global;
  });

  it('should have the right settings', function () {
    test(olark)
      .name('Olark')
      .assumesPageview()
      .readyOnInitialize()
      .global('olark')
      .option('identify', true)
      .option('page', true)
      .option('siteId', '')
      .option('track', false);
  });

  describe('#initialize', function () {
    it('should create the window.olark variable', function () {
      assert(!window.olark);
      olark.initialize();
      assert(window.olark);
    });

    it('should initialize window.olark if it exists', function () {
      window.olark = sinon.spy();
      window.olark.identify = sinon.spy();
      olark.initialize();
      assert(window.olark.identify.calledWith(settings.siteId));
      assert(window.olark.calledWithMatch('api.box.onExpand'));
      assert(window.olark.calledWithMatch('api.box.onShrink'));
      window.olark = undefined;
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      olark.initialize();
      window.olark = sinon.spy(window, 'olark');
    });

    afterEach(function () {
      window.olark.restore();
    });

    it('should send an id', function () {
      olark.identify('id');
      assert(window.olark.calledWith('api.visitor.updateCustomFields', {
        id: 'id'
      }));
    });

    it('should send traits', function () {
      olark.identify(undefined, { trait: true });
      assert(window.olark.calledWith('api.visitor.updateCustomFields', {
        trait: true
      }));
    });

    it('should send an id and traits', function () {
      olark.identify('id', { trait: true });
      assert(window.olark.calledWith('api.visitor.updateCustomFields', {
        id: 'id',
        trait: true
      }));
    });

    it('should send an email', function () {
      olark.identify(undefined, { email: 'name@example.com' });
      assert(window.olark.calledWith('api.visitor.updateEmailAddress', {
        emailAddress: 'name@example.com'
      }));
    });

    it('shouldnt send an empty email', function () {
      olark.identify('id');
      assert(!window.olark.calledWith('api.visitor.updateEmailAddress'));
    });

    it('should send a name', function () {
      olark.identify(undefined, { name: 'first last' });
      assert(window.olark.calledWith('api.visitor.updateFullName', {
        fullName: 'first last'
      }));
    });

    it('shouldnt send an empty name', function () {
      olark.identify('id');
      assert(!window.olark.calledWith('api.visitor.updateFullName'));
    });

    it('should fallback to sending first and last name', function () {
      olark.identify(undefined, {
        firstName: 'first',
        lastName: 'last'
      });
      assert(window.olark.calledWith('api.visitor.updateFullName', {
        fullName: 'first last'
      }));
    });

    it('should fallback to sending only a first name', function () {
      olark.identify(undefined, { firstName: 'first' });
      assert(window.olark.calledWith('api.visitor.updateFullName', {
        fullName: 'first'
      }));
    });

    it('should send a phone number', function () {
      olark.identify(undefined, { phone: 'phone' });
      assert(window.olark.calledWith('api.visitor.updatePhoneNumber', {
        phoneNumber: 'phone'
      }));
    });

    it('shouldnt send an empty phone number', function () {
      olark.identify('id');
      assert(!window.olark.calledWith('api.visitor.updatePhoneNumber'));
    });

    it('should us an id as a nickname', function () {
      olark.identify('id');
      assert(window.olark.calledWith('api.chat.updateVisitorNickname', {
        snippet: 'id'
      }));
    });

    it('should prefer a username as a nickname', function () {
      olark.identify('id', { username: 'username' });
      assert(window.olark.calledWith('api.chat.updateVisitorNickname', {
        snippet: 'username'
      }));
    });

    it('should prefer an email as a nickname', function () {
      olark.identify('id', {
        username: 'username',
        email: 'name@example.com'
      });
      assert(window.olark.calledWith('api.chat.updateVisitorNickname', {
        snippet: 'name@example.com'
      }));
    });

    it('should prefer a name as a nickname', function () {
      olark.identify('id', {
        username: 'username',
        name: 'name'
      });
      assert(window.olark.calledWith('api.chat.updateVisitorNickname', {
        snippet: 'name'
      }));
    });

    it('should prefer a name and email as a nickname', function () {
      olark.identify('id', {
        username: 'username',
        name: 'name',
        email: 'name@example.com'
      });
      assert(window.olark.calledWith('api.chat.updateVisitorNickname', {
        snippet: 'name (name@example.com)'
      }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      olark.initialize();
      window.olark = sinon.spy(window, 'olark');
    });

    afterEach(function (done) {
      window.olark.restore();
      shrinkThen(function () {
        done();
      });
    });

    it('should not send an event by default', function () {
      olark.track('event');
      assert(!window.olark.called);
    });

    it('should not send an event when the chat isnt open', function () {
      olark.options.track = true;
      olark.track('event');
      assert(!window.olark.called);
    });

    it('should send an event', function (done) {
      olark.options.track = true;
      expandThen(function () {
        olark.track('event');
        assert(window.olark.calledWith('api.chat.sendNotificationToOperator', {
          body: 'visitor triggered "event"'
        }));
        done();
      });
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      olark.initialize();
      window.olark = sinon.spy(window, 'olark');
    });

    afterEach(function (done) {
      window.olark.restore();
      shrinkThen(function () {
        done();
      });
    });

    it('shouldnt send an event when the chat isnt open', function () {
      olark.pageview();
      assert(!window.olark.called);
    });

    it('should send a pageview', function (done) {
      var spy = window.olark;
      expandThen(function () {
        olark.page();
        assert(spy.calledWith('api.chat.sendNotificationToOperator', {
          body: 'looking at ' + window.location.href
        }));
        done();
      });
    });

    it('shouldnt send an event when pageview is disabled', function () {
      this.options.pageview = false;
      var spy = window.olark;
      expandThen(function () {
        olark.page();
        assert(!window.olark.called);
      });
    });
  });
});