
describe('Quantcast', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  pCode: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Quantcast: settings });
  this.integration = analytics._integrations.Quantcast;
  this.options = this.integration.options;
  when(function () { return window.__qc; }, done);
});

describe('#name', function () {
  it('Quantcast', function () {
    assert(this.integration.name == 'Quantcast');
  });
});

describe('#key', function () {
  it('pCode', function () {
    assert(this.integration.key == 'pCode');
  });
});

describe('#defaults', function () {
  it('pCode', function () {
    assert(this.integration.defaults.pCode === null);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.pCode == settings.pCode);
  });
});

});