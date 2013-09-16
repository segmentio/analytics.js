
describe('Rollbar', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  accessToken: 'e1674422cbe9419987eb2e7f98adc5ec',
  'server.environment': 'testenvironment'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Rollbar: settings });
  this.integration = analytics._integrations.Rollbar;
  this.options = this.integration.options;
  var stub = window._rollbar.push;
  when(function () { return window._rollbar.push != stub; }, done);
});

describe('#name', function () {
  it('Rollbar', function () {
    assert(this.integration.name == 'Rollbar');
  });
});

describe('#key', function () {
  it('accessToken', function () {
    assert(this.integration.key == 'accessToken');
  });
});

describe('#defaults', function () {
  it('accessToken', function () {
    assert(this.integration.defaults.accessToken === '');
  });

  it('identify', function () {
    assert(this.integration.defaults.identify === true);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.accessToken == settings.accessToken);
    assert(this.options.identify == this.integration.defaults.identify);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    window._rollbar.extraParams = {};
  });

  afterEach(function () {
    this.options.identify = true;
  });

  it('should add an id to metadata', function () {
    analytics.identify('id');
    assert(equal(window._rollbar.extraParams, { person: { id: 'id' } }));
  });

  it('should add traits to person data', function () {
    analytics.identify({ trait: true });
    assert(equal(window._rollbar.extraParams, { person: { trait: true } }));
  });

  it('should add an id and traits to person data', function () {
    analytics.identify('id', { trait: true });
    assert(equal(window._rollbar.extraParams, {
      person: {
        id: 'id',
        trait: true
      }
    }));
  });

  it('shouldn\'t add to person data when identify option is false', function () {
    this.options.identify = false;
    analytics.identify('id');
    assert(equal(window._rollbar.extraParams, {}));
  });
});

});

