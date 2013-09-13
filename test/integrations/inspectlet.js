
describe('Inspectlet', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  wid: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Inspectlet: settings });
  this.integration = analytics._integrations.Inspectlet;
  this.options = this.integration.options;
  when(function () { return window.__insp_; }, done);
});

describe('#name', function () {
  it('Inspectlet', function () {
    assert(this.integration.name == 'Inspectlet');
  });
});

describe('#key', function () {
  it('wid', function () {
    assert(this.integration.key == 'wid');
  });
});

describe('#defaults', function () {
  it('wid', function () {
    assert(this.integration.defaults.wid === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    expect(this.options.wid == settings.wid);
  });
});

});