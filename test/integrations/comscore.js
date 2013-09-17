
describe('comScore', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  c2: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ comScore: settings });
  this.integration = analytics._integrations.comScore;
  this.options = this.integration.options;
  when(function () { return window.COMSCORE; }, done);
});

describe('#name', function () {
  it('comScore', function () {
    assert(this.integration.name == 'comScore');
  });
});

describe('#key', function () {
  it('c2', function () {
    assert(this.integration.key == 'c2');
  });
});

describe('#defaults', function () {
  it('c1', function () {
    assert(this.integration.defaults.c1 === '2');
  });

  it('c2', function () {
    assert(this.integration.defaults.c2 === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.c2 == settings.c2);
    assert(this.options.c1 == this.integration.defaults.c1);
  });
});

});