!(function () {

  suite('Chartbeat');

  var options = {
    'Chartbeat' : {
      uid    : 'x',
      domain : 'example.com'
    }
  };


  // Initialize
  // ----------

  test('loads library and calls ready initialize', function (done) {
    expect(window.pSUPERFLY).to.be(undefined);

    var spy = sinon.spy();
    analytics.ready(spy);
    analytics.initialize(options);

    // Once the library is loaded, the global will exist and ready should have
    // been called.
    setTimeout(function () {
      expect(window.pSUPERFLY).not.to.be(undefined);
      expect(spy.called).to.be(true);
      done();
    }, 1900);
  });

  test('stores options on initialize', function () {
    analytics.initialize(options);
    expect(analytics.providers[0].options.uid).to.equal('x');
    expect(analytics.providers[0].options.domain).to.equal('example.com');
    // We copy over all of the options directly into Chartbeat.
    expect(window._sf_async_config).to.equal(analytics.providers[0].options);
  });


  // Pageview
  // --------

  test('calls virtualPage on pageview', function () {
    var spy = sinon.spy(window.pSUPERFLY, 'virtualPage');
    analytics.pageview();
    expect(spy.calledWith(window.location.pathname)).to.be(true);

    spy.reset();
    analytics.pageview('/url');
    expect(spy.calledWith('/url')).to.be(true);

    spy.restore();
  });

}());