
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
  var stub = window._errs.push;
  when(function () { return window._errs.push != stub; }, done);
});

describe('#name', function () {
  it('Errorception', function () {
    assert(this.integration.name == 'Errorception');
  });
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

  it('meta', function () {
    assert(this.integration.defaults.meta === true);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.projectId == settings.projectId);
    assert(this.options.meta == this.integration.defaults.meta);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
  });

  afterEach(function () {
    this.options.meta = true;
    delete window._errs.meta;
  });

  it('should add an id to metadata', function () {
    analytics.identify('id');
    assert(equal(window._errs.meta, { id: 'id' }));
  });

  it('should add traits to metadata', function () {
    analytics.identify({ trait: true });
    assert(equal(window._errs.meta, { trait: true }));
  });

  it('should add an id and traits to metadata', function () {
    analytics.identify('id', { trait: true });
    assert(equal(window._errs.meta, {
      id: 'id',
      trait: true
    }));
  });

  it('shouldnt add to metadata when meta option is false', function () {
    this.options.meta = false;
    analytics.identify('id');
    assert(!window._errs.meta);
  });
});

});