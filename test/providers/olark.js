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

    beforeEach(analytics.user.clear);

    it('should updates visitor nickname with the best name', function () {
      var spy = sinon.spy(window, 'olark');
      analytics.identify({
        dogs : 1
      });
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify({
        email : 'zeus@segment.io'
      });

      expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
        snippet : 'zeus@segment.io'
      })).to.be(true);

      spy.reset();
      analytics.identify(test.traits);
      expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
        snippet : 'Zeus (zeus@segment.io)'
      })).to.be(true);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
        snippet : test.userId
      })).to.be(true);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith('api.chat.updateVisitorNickname', {
        snippet : 'Zeus (zeus@segment.io)'
      })).to.be(true);

      spy.restore();
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