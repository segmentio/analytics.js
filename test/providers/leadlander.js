
describe('LeadLander', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'LeadLander' : test['LeadLander'] });
      done();
    });

    it('should store options', function () {
      analytics.initialize({ 'LeadLander' : test['LeadLander'] });
      expect(analytics.providers[0].options.llactid).to.equal(test['LeadLander']);
    });

  });

});