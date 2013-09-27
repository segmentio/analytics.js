
describe('MouseStats', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  accountNumber: '5532375730335616295'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ MouseStats: settings });
  this.integration = analytics._integrations.MouseStats;
  this.options = this.integration.options;
  when(function () { return window.msaa; }, done);
});

describe('#name', function () {
  it('MouseStats', function () {
    assert(this.integration.name == 'MouseStats');
  });
});

describe('#key', function () {
  it('accountNumber', function () {
    assert(this.integration.key == 'accountNumber');
  });
});

describe('#defaults', function () {
  it('accountNumber', function () {
    assert(this.integration.defaults.accountNumber === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.accountNumber == settings.accountNumber);
  });

  it('should pass options to MouseStats', function () {
    assert(window.mousestats_Site == settings.accountNumber);
  });
});

});