
describe('Awesomatic', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  appId: 'af392af01603ca383672689241b648b2'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Awesomatic': settings });
  this.integration = analytics._integrations.Awesomatic;
  this.options = this.integration.options;
  when(function () { return window.AwesomaticSettings; }, done);
});

describe('#name', function () {
  it('Awesomatic', function () {
    assert(this.integration.name == 'Awesomatic');
  });
});

describe('#key', function () {
  it('appId', function () {
    assert(this.integration.key == 'appId');
  });
});

describe('#defaults', function () {
  it('appId', function () {
    assert(this.integration.defaults.appId === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });
  it('should store options', function () {
    assert(this.options.appId == settings.appId);
  });
});


describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.stub = sinon.stub(window.Awesomatic, 'load');
  });
  afterEach(function () {
    this.stub.restore();
  });
  it('should call load()', function () {
    analytics.identify('x');
    assert(this.stub.called);
  });
  it('should set email', function () {
    analytics.identify('x', { email: 'email@example.com' });
    assert(this.stub.calledWith({
      userId: 'x',
      email: 'email@example.com'
    }));
  });

});


});