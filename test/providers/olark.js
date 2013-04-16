describe('Olark', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.olark).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Olark' : test['Olark'] });
      expect(window.olark).not.to.be(undefined);
      expect(spy.called).to.be(true);

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
      expect(analytics.providers[0].options.siteId).to.equal(test['Olark']);
    });

  });


  describe('identify', function () {

    var spy;
    beforeEach(function () {
      analytics.user.clear();
      spy = sinon.spy(window, 'olark');
    });
    afterEach(function () { spy.restore(); });

    it('should update with the email', function () {
      analytics.identify({
        email : 'zeus@segment.io'
      });
      expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
        snippet : 'zeus@segment.io'
      })).to.be(true);
    });

    it('should update with the name and email when called', function () {
      analytics.identify(test.traits);
      expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
        snippet : 'Zeus (zeus@segment.io)'
      })).to.be(true);
    });

    it('should update with the user id', function () {
      analytics.identify(test.userId);
      expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
        snippet : test.userId
      })).to.be(true);
    });

    it('should update with the email, name, and traits with userId', function () {
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith('api.chat.updateVisitorNickname', {
        snippet : 'Zeus (zeus@segment.io)'
      })).to.be(true);
    });

    it('should update the visitor email', function () {
      analytics.identify({
        email : 'zeus@segment.io'
      });

      expect(spy.calledWithMatch('api.visitor.updateEmailAddress', {
        emailAddress : 'zeus@segment.io'
      })).to.be(true);
    });

    it('should update the visitor phone number', function () {
      analytics.identify({
        phone : '(555) 555-5555'
      });

      expect(spy.calledWithMatch('api.visitor.updatePhoneNumber', {
        phoneNumber : '(555) 555-5555'
      })).to.be(true);
    });

    it('should update the visitor full name', function () {
      analytics.identify({
        name : 'Hallucinating Chipmunk'
      });
      expect(spy.calledWithMatch('api.visitor.updateFullName', {
        fullName : 'Hallucinating Chipmunk'
      })).to.be(true);

      spy.reset();
      analytics.identify({
        firstName : 'Hallucinating',
        lastName  : 'Chipmunk'
      });
      expect(spy.calledWithMatch('api.visitor.updateFullName', {
        fullName : 'Hallucinating Chipmunk'
      })).to.be(true);
    });

    it('should update the visitor custom fields', function () {
      analytics.identify({
        dogs : 1
      });
      expect(spy.calledWithMatch('api.visitor.updateCustomFields', {
        dogs : 1
      })).to.be(true);
    });
  });

  describe('track', function () {

    it('shouldnt log event to operator when track disabled', function () {
      analytics.providers[0].options.track = false;
      var spy = sinon.spy(window, 'olark');
      analytics.track(test.event, test.properties);
      expect(spy.called).to.be(false);

      spy.restore();
    });

    it('shouldnt log event to operator when track enabled but box shrunk', function () {
      analytics.providers[0].options.track = true;
      var spy = sinon.spy(window, 'olark');
      analytics.track(test.event, test.properties);
      expect(spy.called).to.be(false);

      spy.restore();
    });

    it('should log event to operator when track enabled and box expanded', function (done) {
      analytics.providers[0].options.track = true;
      var spy = sinon.spy(window, 'olark');
      window.olark('api.box.expand');

      setTimeout(function () {
        analytics.track(test.event, test.properties);
        expect(spy.calledWithMatch('api.chat.sendNotificationToOperator', {
          body : 'visitor triggered "' + test.event + '"'
        })).to.be(true);

        window.olark('api.box.shrink');
        spy.restore();

        done();
      }, 900);
    });

  });


  describe('pageview', function () {

    it('shouldnt log pageview to operator when pageview disabled', function () {
      analytics.providers[0].options.pageview = false;
      var spy = sinon.spy(window, 'olark');
      analytics.pageview();
      expect(spy.called).to.be(false);

      spy.restore();
    });

    it('shouldnt log event to operator when pageview enabled but box shrunk', function () {
      analytics.providers[0].options.pageview = true;
      var spy = sinon.spy(window, 'olark');
      analytics.pageview();
      expect(spy.called).to.be(false);

      spy.restore();
    });

    it('should log event to operator when pageview enabled and box expanded', function (done) {
      analytics.providers[0].options.pageview = true;
      var spy = sinon.spy(window, 'olark');
      window.olark('api.box.expand');

      setTimeout(function () {
        analytics.pageview();
        expect(spy.calledWithMatch('api.chat.sendNotificationToOperator', {
          body : 'looking at ' + window.location.href
        })).to.be(true);

        window.olark('api.box.shrink');
        spy.restore();

        done();
      }, 900);
    });
  });

});