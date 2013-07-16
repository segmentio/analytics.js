describe('spinnakr', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'spinnakr' : test['spinnakr'] });

    done();
    });

    it('should store options', function () {
      analytics.initialize({ 'spinnakr' : test['spinnakr'] });
      var options = analytics.providers[0].options;
      expect(options._spinnakr_site_id).to.equal('test['spinnakr']._spinnakr_site_id');
    });

  });

});