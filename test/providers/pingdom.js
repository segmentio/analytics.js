
describe('Pingdom', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , date = require('load-date')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  id: '5168f8c6abe53db732000000'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Pingdom: settings });
  this.integration = analytics._integrations.Pingdom;
  this.options = this.integration.options;
  when(function () { return window.PRUM_EPISODES; }, done);
});

describe('#key', function () {
  it('id', function () {
    assert(this.integration.key == 'id');
  });
});

describe('#defaults', function () {
  it('id', function () {
    assert(this.integration.defaults.id === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.id == settings.id);
  });

  it('should send first byte time to Pingdom', function () {
    assert(date.getTime() == window.PRUM_EPISODES.marks.firstbyte);
  });
});

});