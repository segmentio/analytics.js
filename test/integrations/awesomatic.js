
describe('Awesomatic', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  app_id: 'af392af01603ca383672689241b648b2'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Awesomatic': settings });
  this.integration = analytics._integrations.Awesomatic;
  this.options = this.integration.options;
  when(function () { return window.Awesomatic; }, done);
});

describe('#name', function () {
  it('Awesomatic', function () {
    assert(this.integration.name == 'Awesomatic');
  });
});

describe('#key', function () {
  it('app_id', function () {
    assert(this.integration.key == 'app_id');
  });
});

describe('#defaults', function () {
  it('app_id', function () {
    assert(this.integration.defaults.app_id === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.app_id == settings.app_id);
  });
});


describe('#identify', function () {
  before(function () {
    this.id = 0;
    this.stub = sinon.stub(Awesomatic, 'load');
      analytics.identify('x', { email: 'email@example.com' });
  });

  it('should call load()', function (done) {
    var _this = this;
    analytics.ready(function() {
      assert(_this.stub.called);
      done();
    });
  });

  it('should set email', function (done) {
    analytics.ready(function() {
      assert(AwesomaticSettings.email=='email@example.com');
      done();
    });
  });

});


});