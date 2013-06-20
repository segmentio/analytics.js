describe('Lytics', function () {
  var testOptions = test.Lytics;

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.jstag).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Lytics' : testOptions });

      expect(window.jstag).not.to.be(undefined);
      expect(spy.called).to.be(true);

      // Test that the script has loaded by checking that the
      // global has been added to (the `bind` method)
      var interval = setInterval(function () {
        if (!window.jstag.bind) return;
        expect(window.jstag.bind).to.be.a('function');
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should load the library unminified only if specified', function() {
      var extend  = require('segmentio-extend'),
        options = extend({}, testOptions, { minified: false }),
        selector = 'script[src$="c.lytics.io/static/io.js"]';

      expect($(selector).length).to.equal(0);
      analytics.initialize({ 'Lytics' : options });
      expect($(selector).length).to.equal(1);
    });

    it('should store options', function () {
      analytics.initialize({ 'Lytics' : testOptions });
      expect(analytics.providers[0].options.cid).to.equal(testOptions.cid);
    });

    it('should pass options directly to the library', function() {
      analytics.initialize({ 'Lytics' : testOptions });

      expect(window.jstag._c.cid).to.equal(testOptions.cid);
      expect(window.jstag._c.cookie).to.equal(testOptions.cookie);
      expect(window.jstag._c.qsargs).to.eql(testOptions.qsargs);
    });
  });

  describe('pageview', function () {

    it('calls jstag.send on pageview', function () {
      var spy = sinon.spy(window.jstag, 'send');
      analytics.pageview();
      expect(spy.called).to.be(true);
      spy.restore();
    });

  });

  describe('track', function () {

    it('should track an event send', function (done) {
      analytics.initialize({ 'Lytics' : testOptions });
      expect(window.jstag).not.to.be(undefined);

      var interval = setInterval(function () {
        // wait for full load, bind will exist once js has loaded from cdn
        // if cdn hasn't loaded, then this test will fail for timeout
        if (!window.jstag.bind ) return;

        var spy = sinon.spy(window.jstag, 'send');

        analytics.track(test.event, test.properties);

        expect(spy.called).to.be(true);

        clearInterval(interval);
        done();

        expect(spy.calledWith(
          sinon.match({ type : test.properties.type })
        )).to.be(true);
        spy.restore();

      }, 20);

    });

  });

  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should accept user traits', function () {
      var spy = sinon.spy(window.jstag, 'send');

      analytics.identify(test.userId, test.traits);
      expect(spy.called).to.be(true);
      expect(spy.calledWith(
        sinon.match({ email : 'zeus@segment.io'})
      )).to.be(true);

      spy.restore();
    });

  });

});
