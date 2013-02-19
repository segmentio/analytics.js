
describe('LiveChat', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window.__lc).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'LiveChat' : test['LiveChat'] });
      expect(window.__lc).not.to.be(undefined);
      expect(window.LC_API).to.be(undefined);

      setTimeout(function () {
        expect(window.LC_API).not.to.be(undefined);
        expect(spy.called).to.be(true);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'LiveChat' : test['LiveChat'] });
      expect(analytics.providers[0].options.license).to.equal(test['LiveChat']);
    });

  });


  describe('identify', function () {

    it('should set user id', function () {
      var spy = sinon.spy(window.LC_API, 'set_custom_variables');
      analytics.identify(test.userId);
      expect(spy.calledWith([
        { name : 'User ID', value : test.userId }
      ])).to.be(true);

      spy.restore();
    });

    it('should set traits', function () {
      // Reset the internal user id first.
      analytics.userId = undefined;

      var stub = sinon.stub(window.LC_API, 'set_custom_variables');
      analytics.identify(test.traits);
      expect(stub.calledWith([
        { name : 'name', value : test.traits.name },
        { name : 'email', value : test.traits.email },
        { name : 'created', value : test.traits.created }
      ])).to.be(true);

      stub.restore();
    });

    it('should set user id and traits', function () {
      var stub = sinon.stub(window.LC_API, 'set_custom_variables');
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith([
        { name : 'User ID', value : test.userId },
        { name : 'name', value : test.traits.name },
        { name : 'email', value : test.traits.email },
        { name : 'created', value : test.traits.created }
      ])).to.be(true);

      stub.restore();
    });

  });

});