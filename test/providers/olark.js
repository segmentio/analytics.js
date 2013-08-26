describe('Olark', function () {

  // HACK: phantomjs breaks without an `Event` constructor.
  if (!window.Event) window.Event = window.CustomEvent;

  var analytics = require('analytics')
    , tick = require('next-tick');


  /**
   * Initialize.
   */

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.olark).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Olark' : test['Olark'] });
      expect(window.olark).not.to.be(undefined);

      tick(function () {
        expect(spy.called).to.be(true);
      });

      // When the library loads, it creats a `__get_olark_key` method.
      var interval = setInterval(function () {
        if (!window.__get_olark_key) return;
        expect(window.__get_olark_key).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Olark' : test['Olark'] });
      expect(analytics._providers[0].options.siteId).to.equal(test['Olark']);
    });

  });


  /**
   * Identify.
   */

  describe('identify', function () {

    var spy;

    beforeEach(function () {
      analytics._user.clear();
      spy = sinon.spy(window, 'olark');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should update the visitor custom fields', function () {
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith('api.visitor.updateCustomFields', test.traits)).to.be(true);
    });

    describe('email', function () {

      var method = 'api.visitor.updateEmailAddress';

      it('should use the email trait', function () {
        analytics.identify(test.userId, test.traits);
        expect(spy.calledWith(method, { emailAddress : test.traits.email })).to.be(true);
      });

      it('should use the userId if its an email', function () {
        analytics.identify(test.traits.email);
        expect(spy.calledWith(method, { emailAddress : test.traits.email })).to.be(true);
      });

      it('shouldnt use the userId if its not an email', function () {
        analytics.identify(test.userId);
        expect(spy.calledWith(method)).to.be(false);
      });

    });

    describe('name', function () {

      var method = 'api.visitor.updateFullName';

      it('should use the name trait', function () {
        analytics.identify({
          name      : 'name',
          firstName : 'first',
          lastName  : 'last'
        });
        expect(spy.calledWith(method, { fullName : 'name' })).to.be(true);
      });

      it('should use the first name if possible', function () {
        analytics.identify({ firstName : 'first' });
        expect(spy.calledWith(method, { fullName : 'first' })).to.be(true);
      });

      it('should use the first and last name if possible', function () {
        analytics.identify({
          firstName : 'first',
          lastName  : 'last'
        });
        expect(spy.calledWith(method, { fullName : 'first last' })).to.be(true);
      });

    });

    describe('phone', function () {

      var method = 'api.visitor.updatePhoneNumber';

      it('should use the phone trait', function () {
        analytics.identify({ phone : '1' });
        expect(spy.calledWith(method, { phoneNumber : '1' })).to.be(true);
      });

    });

    describe('nickname', function () {

      var method = 'api.chat.updateVisitorNickname';

      it('should use the name and email', function () {
        analytics.identify('id', {
          name      : 'name',
          firstName : 'first',
          lastName  : 'last',
          email     : 'email@example.com'
        });
        expect(spy.calledWith(method, { snippet : 'name (email@example.com)' })).to.be(true);
      });

      it('should falback to name', function () {
        analytics.identify('id', {
          name      : 'name',
          firstName : 'first',
          lastName  : 'last'
        });
        expect(spy.calledWith(method, { snippet : 'name' })).to.be(true);
      });

      it('should fallback to first and last names', function () {
        analytics.identify('id', {
          firstName : 'first',
          lastName  : 'last',
          email     : 'email@example.com'
        });
        expect(spy.calledWith(method, { snippet : 'first last (email@example.com)' })).to.be(true);
      });

      it('should fallback to first', function () {
        analytics.identify('id', {
          firstName : 'first',
          email     : 'email@example.com'
        });
        expect(spy.calledWith(method, { snippet : 'first (email@example.com)' })).to.be(true);
      });

      it('should fallback to email', function () {
        analytics.identify('id', {
          email : 'email@example.com'
        });
        expect(spy.calledWith(method, { snippet : 'email@example.com' })).to.be(true);
      });

      it('should fallback to userId', function () {
        analytics.identify('id');
        expect(spy.calledWith(method, { snippet : 'id' })).to.be(true);
      });

    });

  });


  /**
   * Track.
   */

  describe('track', function () {

    var spy;

    beforeEach(function () {
      spy = sinon.spy(window, 'olark');
    });

    afterEach(function () {
      spy.restore();
      window.olark('api.box.shrink');
    });

    it('shouldnt log event to operator when track disabled', function () {
      analytics._providers[0].options.track = false;
      analytics.track(test.event, test.properties);
      expect(spy.called).to.be(false);
    });

    it('shouldnt log event to operator when track enabled but box shrunk', function () {
      analytics._providers[0].options.track = true;
      analytics.track(test.event, test.properties);
      expect(spy.called).to.be(false);
    });

    it('should log event to operator when track enabled and box expanded', function (done) {
      analytics._providers[0].options.track = true;
      window.olark('api.box.expand');

      // long timeout for phantomjs tests, where it's slow
      setTimeout(function () {
        analytics.track(test.event, test.properties);
        expect(spy.calledWithMatch('api.chat.sendNotificationToOperator', {
          body : 'visitor triggered "' + test.event + '"'
        })).to.be(true);
        window.olark('api.box.shrink');
        done();
      }, 1000);
    });

  });


  /**
   * Pageview.
   */

  describe('pageview', function () {

    var spy;

    beforeEach(function () {
      spy = sinon.spy(window, 'olark');
    });

    afterEach(function () {
      spy.restore();
      window.olark('api.box.shrink');
    });

    it('shouldnt log pageview to operator when pageview disabled', function () {
      analytics._providers[0].options.pageview = false;
      analytics.pageview();
      expect(spy.called).to.be(false);
    });

    it('shouldnt log event to operator when pageview enabled but box shrunk', function () {
      analytics._providers[0].options.pageview = true;
      analytics.pageview();
      expect(spy.called).to.be(false);
    });

    it('should log event to operator when pageview enabled and box expanded', function (done) {
      analytics._providers[0].options.pageview = true;
      window.olark('api.box.expand');

      // long timeout for phantomjs tests, where it's slow
      setTimeout(function () {
        analytics.pageview();
        expect(spy.calledWithMatch('api.chat.sendNotificationToOperator', {
          body : 'looking at ' + window.location.href
        })).to.be(true);
        done();
      }, 1000);
    });
  });

});