describe('Rollbar', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._rollbar).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Rollbar' : test['Rollbar'].basic });

      // Rollbar sets up a queue, so it's ready immediately.
      expect(window._rollbar).not.to.be(undefined);
      expect(window._rollbar.push).to.equal(push);
      expect(window._ratchet).not.to.be(window._rollbar);
      expect(spy.called).to.be(true);

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (window._rollbar.push === push) return;
        expect(window._rollbar.push).not.to.equal(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Rollbar' : test['Rollbar'].basic.accessToken });
      var options = analytics.providers[0].options;
      expect(options.accessToken).to.equal(test['Rollbar'].basic.accessToken);
    });

    it('should hook track by default', function () {
      analytics.initialize({ 'Rollbar' : test['Rollbar'].basic.accessToken });
      var options = analytics.providers[0].options;
      expect(options.track).to.equal(true);
    });

    it('should save Rollbar options', function () {
      analytics.initialize({ 'Rollbar' : test['Rollbar'].advanced });
      var options = analytics.providers[0].options;
      expect(options.track).to.equal(true);
      expect(options.checkIgnore).to.be.a('function');

      var ignoreRet = options.checkIgnore('hello', 'http://foo.com', 33);
      expect(ignoreRet).to.be.an('array');
      expect(ignoreRet[0]).to.equal('hello');
      expect(ignoreRet[1]).to.equal('http://foo.com');
      expect(ignoreRet[2]).to.equal(33);

      expect(options.context).to.equal('RollbarContext');
      expect(options.itemsPerMinute).to.equal(10);
      expect(options.level).to.equal('error');
      expect(options['server.branch']).to.equal('TestBranch');
      expect(options['server.environment']).to.equal('TestEnvironment');
      expect(options['server.host']).to.equal('TestHost');
      expect(options.customMsg).to.equal('CustomMessage');
      expect(options.customObj).to.be.an('object');
      expect(options.customObj.foo).to.equal('bar');
    });
  });


  describe('identify', function () {

    it('should add metadata', function () {
      var extend = require('segmentio-extend');
      var spy  = sinon.spy();

      window._rollbar = undefined;
      window._ratchet = undefined;

      analytics.ready(spy);
      analytics.initialize({ 'Rollbar' : test['Rollbar'].advanced });

      expect(window._rollbar).to.be.an('array');
      expect(window._rollbar.length).to.equal(2);
      expect(window._rollbar[1].person).to.be(undefined);

      analytics.providers[0].options.meta = true;
      analytics.identify(test.userId, test.traits);

      expect(window._rollbar[1].person.id).to.equal('user');
      expect(window._rollbar[1].person.email).to.equal('zeus@segment.io');
    });

  });

  describe('track', function () {

    it('should push track message', function() {
      var extend = require('segmentio-extend');
      var spy  = sinon.spy();

      window._rollbar = undefined;
      window._ratchet = undefined;

      analytics.ready(spy);
      analytics.initialize({ 'Rollbar' : test['Rollbar'].advanced });
      analytics.identify(test.userId, test.traits);

      var stub = sinon.spy(window._rollbar, 'push');
      var msg = 'Hello World!';
      var props = {level: 'debug', custom: 'CustomVal', superCustom: {foo: 'bar'}};

      analytics.track(msg, props);

      var stubArgs = stub.args[0];
      expect(stubArgs.length).to.equal(1);

      stubArgs = stubArgs[0];
      expect(stubArgs).to.be.an('object');
      expect(stubArgs.msg).to.equal(msg);
      expect(stubArgs.level).to.equal('debug');
      expect(stubArgs.custom).to.equal('CustomVal');
      expect(stubArgs.superCustom).to.be.an('object');
      expect(stubArgs.superCustom.foo).to.equal('bar');

      stub.restore();
    });
  });

});
