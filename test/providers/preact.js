describe('Preact', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load libarary', function (done) {
      expect(window._lnq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
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
    var stub;

    beforeEach(function () {
      analytics.user.clear();
      stub = sinon.stub(window._lnq, 'push');
    });

    afterEach(function () {
      stub.restore();
    });

    it('should push _setPersonData', function () {
      analytics.identify();
      expect(stub.called).to.be(false);

      stub.reset();
      analytics.identify(test.traits);
      expect(stub.called).to.be(false);

      stub.reset();
      analytics.identify(test.userId, test.traits);

      // Swap the `created` trait to the `created_at` that Preact needs
      // and convert it from milliseconds to seconds.
      if (test.traits.created) {
        test.traits.created_at = Math.floor(test.traits.created/1000);
        delete test.traits.created;
      }

      expect(stub.calledWith(['_setPersonData', {
        name       : test.traits.name,
        email      : test.traits.email,
        uid        : test.userId,
        properties : test.traits
      }])).to.be(true);

    });

  });


  describe('group', function () {
    var stub;
    beforeEach(function () { stub = sinon.stub(window._lnq, 'push'); });
    afterEach(function () { stub.restore(); });

    it('should push _setAccount', function () {
      analytics.group('group', {
        name      : 'Group',
        employees : 42
      });
      expect(stub.calledWith(['_setAccount', {
        id        : 'group',
        name      : 'Group',
        employees : 42
      }])).to.be(true);
    });

  });


  describe('track', function () {
    var stub;

    beforeEach(function () {
      stub = sinon.stub(window._lnq, 'push');
    });

    afterEach(function () {
      stub.restore();
    });

    it('should call track', function () {
      var properties = {
        note    : 'A Note',
        revenue : 49.99
      };
      analytics.track(test.event, properties);
      expect(stub.calledWith(['_logEvent',
        sinon.match({
          name    : test.event,
          note    : 'A Note',
          revenue : 4999
        }),
        sinon.match({})
      ])).to.be(true);
    });

  });


});