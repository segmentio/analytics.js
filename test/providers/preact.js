describe('Preact', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load libarary', function (done) {
      expect(window._lnq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Preact' :  test['Preact'] });
      analytics.initialize({ 'Preact' : test['Preact'] });
      expect(analytics.providers[0].options.projectCode).to.equal('x');

      // When the library loads, it will create a `_lnq` global.
      var interval = setInterval(function () {
        if (!window._lnq) return;
        expect(window._lnq).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should push _setPersonData', function () {
      var spy = sinon.spy(window._lnq, 'push');
      analytics.identify();
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify(test.traits);
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      
      expect(spy.calledWith(['_setPersonData', {
        name : test.traits.name,
        email : test.traits.email,
        uid : test.userId,
        properties : test.traits
      }])).to.be(true);

      spy.restore();
    });

  });


  describe('track', function () {

    // Preact adds custom properties, so we need to have a loose match.
    it('should call track', function () {
      var personEvent = {
        name : test.event,
        target_id : 'abc',
        note : null,
        properties.created_at : Math.floor(traits.created/1000);
      }
      var properties = {
        item_count : 99,
        target_id : 'abc'
      };

      var spy = sinon.spy(window._lnq, 'push');
      analytics.track(test.event, properties);
      expect(spy.calledWith(['_logEvent', sinon.match(personEvent), sinon.match(properties)])).to.be(true);

      spy.restore();
    });

  });

});