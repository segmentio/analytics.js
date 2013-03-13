describe('LiveChat', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.__lc).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'LiveChat' : test['LiveChat'] });
      expect(window.__lc).not.to.be(undefined);
      expect(window.LC_API).to.be(undefined);

      // When the library loads, `LC_API` and `LC_Invite` will be defined.
      var interval = setInterval(function () {
        if (!window.LC_API || !window.LC_Invite) return;
        expect(window.LC_API).not.to.be(undefined);
        expect(window.LC_Invite).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'LiveChat' : test['LiveChat'] });
      expect(analytics.providers[0].options.license).to.equal(test['LiveChat']);
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should set user id', function () {
      var stub = sinon.stub(window.LC_API, 'set_custom_variables');
      analytics.identify(test.userId);
      expect(stub.args[0][0]).to.eql([
        { name : 'User ID', value : test.userId }
      ]);
      stub.restore();
    });

    it('should set traits', function () {
      var stub = sinon.stub(window.LC_API, 'set_custom_variables');
      analytics.identify(test.traits);
      expect(stub.args[0][0]).to.eql([
        { name : 'name', value : test.traits.name },
        { name : 'email', value : test.traits.email },
        { name : 'created', value : test.traits.created }
      ]);
      stub.restore();
    });

    it('should set user id and traits', function () {
      var stub = sinon.stub(window.LC_API, 'set_custom_variables');
      analytics.identify(test.userId, test.traits);
      expect(stub.args[0][0]).to.eql([
        { name : 'User ID', value : test.userId },
        { name : 'name', value : test.traits.name },
        { name : 'email', value : test.traits.email },
        { name : 'created', value : test.traits.created }
      ]);
      stub.restore();
    });

  });

});