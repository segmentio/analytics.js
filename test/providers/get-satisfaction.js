describe('Get Satisfaction', function () {

  var analytics = require('analytics');


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready, add div and load library', function (done) {
      expect(window.GSFN).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Get Satisfaction' : test['Get Satisfaction'] });

      // It makes a div that will become the tab.
      var div = $('#getsat-widget-' + test['Get Satisfaction']);
      expect(div.length).not.to.be(0);

      // Once the library loads, `GSFN` gets set.
      var interval = setInterval(function () {
        if (!window.GSFN) return;
        expect(window.GSFN).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Get Satisfaction' : test['Get Satisfaction'] });
      expect(analytics._providers[0].options.widgetId).to.equal(test['Get Satisfaction']);
    });

  });

});