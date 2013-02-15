var analytics = require('analytics'),
  clone     = require('component-clone');

!(function (undefined) {

  suite('Bitdeli');

  var options = {
    'Bitdeli' : {
      inputId   : 'x',
      authToken : 'y'
    }
  };

  var event = 'event';

  var properties = {
    count : 42
  };

  var userId = 'user';

  var traits = {
    name  : 'Zeus',
    email : 'zeus@segment.io'
  };

  var url = '/url';


  // Initialize
  // ----------

  test('calls ready and loads library on initialize', function (done) {
    expect(window._bdq).to.be(undefined);

    // The Bitdeli provider uses a queue, so it's ready right away.
    var spy = sinon.spy();
    analytics.ready(spy);
    analytics.initialize(options);
    expect(spy.called).to.be(true);

    // After initialize, the queue should be made, but the library isn't
    // loaded yet, so `_version` isn't defined.
    expect(window._bdq).not.to.be(undefined);
    expect(window._bdq._version).to.be(undefined);

    // Once the library loads, `_version` is defined.
    setTimeout(function () {
      expect(window._bdq._version).not.to.be(undefined);
      done();
    }, 1900);
  });

  test('stores options on initialize', function () {
    analytics.initialize(options);
    expect(analytics.providers[0].options.inputId).to.equal('x');
    expect(analytics.providers[0].options.authToken).to.equal('y');
  });

  test('pushes "trackPageview" on initialize', function () {
    window._bdq = [];
    var spy = sinon.spy(window._bdq, 'push');

    analytics.initialize({ 'Bitdeli' : options });

    expect(spy.calledWith(['trackPageview', undefined])).to.be(true);
    spy.restore();
  });

  test('can disable initial "trackPageview" on initialize', function () {
    window._bdq = [];
    var spy = sinon.spy(window._bdq, 'push');

    var modifiedSettings = clone(options);
    modifiedSettings.initialPageview = false;
    analytics.initialize({ 'Bitdeli' : modifiedSettings });

    expect(spy.calledWith(['trackPageview'])).to.be(false);
    spy.restore();
  });


  // Identify
  // --------

  test('pushes "identify" on identify', function () {
    var spy = sinon.spy(window._bdq, 'push');
    analytics.identify(traits);
    expect(spy.calledWith(['identify', userId])).to.be(false);

    spy.reset();
    analytics.identify(userId);
    expect(spy.calledWith(['identify', userId])).to.be(true);

    spy.reset();
    analytics.identify(userId, traits);
    expect(spy.calledWith(['identify', userId])).to.be(true);

    spy.restore();
  });

  test('pushes "set" on identify', function () {
    var spy = sinon.spy(window._bdq, 'push');
    analytics.identify(traits);
    expect(spy.calledWith(['set', traits])).to.be(true);

    spy.reset();
    analytics.identify(userId);
    expect(spy.calledWith(['set', traits])).to.be(false);

    spy.reset();
    analytics.identify(userId, traits);
    expect(spy.calledWith(['set', traits])).to.be(true);

    spy.restore();
  });


  // Track
  // -----

  test('pushes "track" on track', function () {
    var spy = sinon.spy(window._bdq, 'push');
    analytics.track(event, properties);
    expect(spy.calledWith(['track', event, properties])).to.be(true);

    spy.restore();
  });


  // Pageview
  // --------

  test('pushes "trackPageview" on pageview', function () {
    var spy = sinon.spy(window._bdq, 'push');
    analytics.pageview();
    expect(spy.calledWith(['trackPageview', undefined])).to.be(true);

    spy.reset();
    analytics.pageview(url);
    expect(spy.calledWith(['trackPageview', url])).to.be(true);

    spy.restore();
  });


}());
