
describe('LeadLander', function () {

  var analytics = require('analytics')
    , tick = require('next-tick');

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'LeadLander' : test['LeadLander'] });

      tick(function () {
        expect(spy.called).to.be(true);
        done();
      });
    });

    it('should store options', function () {
      analytics.initialize({ 'LeadLander' : test['LeadLander'] });
      expect(analytics._providers[0].options.llactid).to.equal(test['LeadLander']);
    });

  });

});