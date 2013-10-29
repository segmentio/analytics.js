
describe('Drip', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  account: '9999999'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Drip': settings });
  this.integration = analytics._integrations['Drip'];
  this.options = this.integration.options;
  when(function () { return window.dc; }, done);
});

describe('#name', function () {
  it('Drip', function () {
    assert(this.integration.name == 'Drip');
  });
});

describe('#key', function () {
  it('account', function () {
    assert(this.integration.key == 'account');
  });
});

describe('#defaults', function () {
  it('account', function () {
    assert(this.integration.defaults.account === '');
    assert(this.integration.defaults.debug === false);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.account == settings.account);
  });
});


describe('#track', function () {
  beforeEach(function () {
    this.goal = 999;
    this.context = { 'Drip': { 'goal': this.goal } };
    this.stub = sinon.stub(window._dcq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should not track unless a goal id is provided', function () {
    analytics.track('event', { revenue: 9.99 });
    assert(this.stub.neverCalledWith(sinon.match.any));
  });

  it('should exclude value property if revenue is not set', function () {
    analytics.track('event', {}, this.context);
    assert(this.stub.calledWith(['trackConversion', { id: this.goal }]));
  });

  it('should convert revenue to cents and alias to "value"', function () {
    analytics.track('event', { revenue: 9.99 }, this.context);
    assert(this.stub.calledWith(['trackConversion', { id: this.goal, value: 999 }]));
  });
});

});