
describe('UserVoice', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  widgetId: 'qTSuuylq5nZrsjC0L8bmg', // new
  forumId: 193715,                   // new
  // widgetId: 'QmFQKZn7ovZ9AJIMz7Q',   // classic
  // forumId: 191260,                   // classic
  tabLabel: 'test',
  defaultMode: 'feedback',
  tabColor: '#ff0000'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ UserVoice: settings });
  this.integration = analytics._providers[0];
  this.options = this.integration.options;
  when(function () { return window.UserVoice.account; }, done);
});

describe('#key', function () {
  it('widgetId', function () {
    assert(this.integration.key == 'widgetId');
  });
});

describe('#defaults', function () {
  it('widgetId', function () {
    assert(this.integration.defaults.widgetId === '');
  });

  it('forumId', function () {
    assert(this.integration.defaults.forumId === null);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.widgetId == settings.widgetId);
    assert(this.options.forumId == settings.forumId);
  });

  it('should show the tab', function (done) {
    when(function () { return document.getElementById('uvTab'); }, done);
  });

  it('should expose a showClassicWidget global', function () {
    assert(window.showClassicWidget);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window.UserVoice, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith(['setCustomFields', { id: 'id' }]));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.stub.calledWith(['setCustomFields', { trait: true }]));
  });

  it('should send an id and traits', function () {
    analytics.identify({ id: 'id', trait: true });
    assert(this.stub.calledWith(['setCustomFields', { id: 'id', trait: true }]));
  });
});

});