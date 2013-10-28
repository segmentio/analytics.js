
describe('Evergage', function () {

  var analytics = window.analytics || require('analytics');
  var assert = require('assert');
  var jquery = require('jquery');
  var sinon = require('sinon');
  var when = require('when');

  var settings = {
    account: 'segmentiotest',
    dataset: 'segio_b2b_anon',
    minified: false,
    loggingLevel: 'NONE'
  };

  before(function (done) {
    this.timeout(3000);
    this.spy = sinon.spy();
    analytics.ready(this.spy);
    analytics.initialize({ 'Evergage': settings });
    this.integration = analytics._integrations['Evergage'];
    this.options = this.integration.options;
    var stub = window._aaq.push;
    when(function () { return window._aaq.push != stub; }, done);
  });

  describe('#name', function () {
    it('Evergage', function () {
      assert(this.integration.name == 'Evergage');
    });
  });

  describe('#defaults', function () {
    it('account', function () {
      assert(this.integration.defaults.account === null);
    });

    it('dataset', function () {
      assert(this.integration.defaults.dataset === null);
    });
  });

  describe('#initialize', function () {
    it('should call ready', function () {
      assert(this.spy.called);
    });

    it('should store options', function () {
      assert(this.options.account == settings.account);
      assert(this.options.dataset == settings.dataset);
    });

    it('should define a global tracker', function () {
      assert('object' == typeof window.Evergage);
    });

    it('should show a message', function (done) {
      when(function () {
        return (
          jquery('.evergage-qtip').length &&
          jquery('.evergage-qtip').css('opacity') == 1
        );
      }, done);
    });

    it('should track a pageview with the canonical url');

    after(function() {
      window.Evergage.hideAllMessages();
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      analytics.user().reset();
      this.stub = sinon.stub(window._aaq, 'push');
    });

    afterEach(function () {
      this.stub.restore();
    });

    it('should send an id', function () {
      analytics.identify('id');
      assert(this.stub.calledWith(['setUser', 'id']));
    });

    it('should not send just traits', function () {
      analytics.identify({ trait: true });
      assert(!this.stub.called);
    });

    it('should send an id and traits', function () {
      analytics.identify('id', { trait: true });
      assert(this.stub.calledWith(['setUserField', 'trait', true, 'page']));
      assert(this.stub.calledWith(['setUser', 'id']));
    });

    it('should send an email', function () {
      analytics.identify('id', { email: 'name@example.com' });
      assert(this.stub.calledWith(['setUserField', 'userEmail', 'name@example.com', 'page']));
      assert(this.stub.calledWith(['setUser', 'id']));
    });

    it('should send a name', function () {
      analytics.identify('id', { name: 'name' });
      assert(this.stub.calledWith(['setUserField', 'userName', 'name', 'page']));
      assert(this.stub.calledWith(['setUser', 'id']));
    });
  });

  describe('#group', function () {
    beforeEach(function () {
      this.stub = sinon.stub(window._aaq, 'push');
      analytics.group().reset();
    });

    afterEach(function () {
      this.stub.restore();
    });

    it('should send an id', function () {
      analytics.group('id');
      assert(this.stub.calledWith(['setCompany', 'id']));
    });

    it('should not send just properties', function () {
      analytics.group({ property: true });
      assert(!this.stub.called);
    });

    it('should send an id and properties', function () {
      analytics.group('id', { property: true });
      assert(this.stub.calledWith(['setAccountField', 'property', true, 'page']));
      assert(this.stub.calledWith(['setCompany', 'id']));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      this.stub = sinon.stub(window._aaq, 'push');
    });

    afterEach(function () {
      this.stub.restore();
    });

    it('should send an event', function () {
      analytics.track('event');
      assert(this.stub.calledWith(['trackAction', 'event', {}]));
    });

    it('should send an event and properties', function () {
      analytics.track('event', { property: true });
      assert(this.stub.calledWith(['trackAction', 'event', { property: true }]));
    });
  });

  describe('#pageview', function () {
    beforeEach(function () {
      this.stub = sinon.stub(window.Evergage, 'init');
    });

    afterEach(function () {
      this.stub.restore();
    });

    it('should call pageview', function () {
      analytics.pageview();
      assert(this.stub.calledWith(true));
    });
  });

});