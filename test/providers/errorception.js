
describe('Errorception', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  projectId: '506b76b52f52c3f662000140'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Errorception: settings });
  this.integration = analytics._integrations.Errorception;
  this.options = this.integration.options;
  when(function () { return window.__adroll; }, done);
});

describe('#key', function () {
  it('projectId', function () {
    assert(this.integration.key == 'projectId');
  });
});

describe('#defaults', function () {
  it('projectId', function () {
    assert(this.integration.defaults.projectId === '');
  });

  it('showFeedbackTab', function () {
    assert(this.integration.defaults.showFeedbackTab === true);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.advId == settings.advId);
    assert(this.options.pixId == settings.pixId);
  });

  it('should set custom data', function () {
    assert(equal(window.adroll_custom_data, {
      id: 'id',
      trait: true
    }));
  });
});

});





describe('Errorception', function () {

  var analytics = require('analytics')
    , tick = require('next-tick');


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._errs).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Errorception' : test['Errorception'] });

      // Errorception sets up a queue, so it's ready immediately.
      expect(window._errs).not.to.be(undefined);
      expect(window._errs.push).to.equal(push);

      tick(function () {
        expect(spy.called).to.be(true);
      });

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (window._errs.push === push) return;
        expect(window._errs.push).not.to.equal(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Errorception' : test['Errorception'] });
      var options = analytics._providers[0].options;
      expect(options.projectId).to.equal(test['Errorception']);
    });

    it('should call the old onerror when an error happens', function () {
      var spy = sinon.spy();
      window.onerror = spy;

      analytics.initialize({ 'Errorception' : test['Errorception'] });
      window.onerror('asdf', 'asdf');

      expect(spy.called).to.be(true);
      expect(spy.calledWith('asdf', 'asdf')).to.be(true);
    });

  });


  describe('identify', function () {

    it('should add metadata', function () {
      var extend = require('segmentio-extend');

      expect(window._errs.meta).to.be(undefined);

      analytics._providers[0].options.meta = true;
      analytics.identify(test.userId, test.traits);

      expect(window._errs.meta).to.eql(extend({}, test.traits, { id : test.userId }));
    });

    it('shouldnt add metadata', function () {
      window._errs.meta = undefined;

      analytics._providers[0].options.meta = false;
      analytics.identify(test.userId, test.traits);

      expect(window._errs.meta).to.be(undefined);
    });

  });

});