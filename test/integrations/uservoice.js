
describe('UserVoice', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , jQuery = require('jquery')
  , sinon = require('sinon')
  , unix = require('to-unix-timestamp')
  , when = require('when');

describe('New', function () {

var settings = {
  apiKey: 'EvAljSeJvWrrIidgVvI2g'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ UserVoice: settings });
  this.integration = analytics._integrations.UserVoice;
  this.options = this.integration.options;
  when(function () { return window.UserVoice.account; }, done);
});

describe('#name', function () {
  it('UserVoice', function () {
    assert(this.integration.name == 'UserVoice');
  });
});

describe('#key', function () {
  it('apiKey', function () {
    assert(this.integration.key == 'apiKey');
  });
});

describe('#defaults', function () {
  it('classic', function () {
    assert(this.integration.defaults.classic === false);
  });

  it('apiKey', function () {
    assert(this.integration.defaults.apiKey === '');
  });

  it('forumId', function () {
    assert(this.integration.defaults.forumId === null);
  });

  it('showWidget', function () {
    assert(this.integration.defaults.showWidget === true);
  });

  it('mode', function () {
    assert(this.integration.defaults.mode === 'contact');
  });

  it('accentColor', function () {
    assert(this.integration.defaults.accentColor === '#448dd6');
  });

  it('trigger', function () {
    assert(this.integration.defaults.trigger === null);
  });

  it('triggerPosition', function () {
    assert(this.integration.defaults.triggerPosition === 'bottom-right');
  });

  it('triggerColor', function () {
    assert(this.integration.defaults.triggerColor === '#ffffff');
  });

  it('triggerBackgroundColor', function () {
    assert(this.integration.defaults.triggerBackgroundColor === 'rgba(46, 49, 51, 0.6)');
  });

  it('primaryColor', function () {
    assert(this.integration.defaults.primaryColor === '#cc6d00');
  });

  it('linkColor', function () {
    assert(this.integration.defaults.linkColor === '#007dbf');
  });

  it('defaultMode', function () {
    assert(this.integration.defaults.defaultMode === 'support');
  });

  it('tabLabel', function () {
    assert(this.integration.defaults.tabLabel === 'Feedback & Support');
  });

  it('tabColor', function () {
    assert(this.integration.defaults.tabColor === '#cc6d00');
  });

  it('tabPosition', function () {
    assert(this.integration.defaults.tabPosition === 'middle-right');
  });

  it('tabInverted', function () {
    assert(this.integration.defaults.tabInverted === false);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.apiKey == settings.apiKey);
  });

  it('should show the trigger', function (done) {
    when(function () { return jQuery('.uv-icon').length; }, done);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.stub = sinon.stub(window.UserVoice, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith(['identify', { id: 'id' }]));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.stub.calledWith(['identify', { trait: true }]));
  });

  it('should send an id and traits', function () {
    analytics.identify({ id: 'id', trait: true });
    assert(this.stub.calledWith(['identify', { id: 'id', trait: true }]));
  });

  it('should convert a created date', function () {
    var date = new Date();
    analytics.identify({ created: date });
    assert(this.stub.calledWith(['identify', { created_at: unix(date) }]));
  });
});

describe('#group', function () {
  beforeEach(function () {
    analytics.group().reset();
    this.stub = sinon.stub(window.UserVoice, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.group('id');
    assert(this.stub.calledWith(['identify', { account: { id: 'id' }}]));
  });

  it('should send properties', function () {
    analytics.group({ property: true });
    assert(this.stub.calledWith(['identify', { account: { property: true }}]));
  });

  it('should send an id and properties', function () {
    analytics.group({ id: 'id', property: true });
    assert(this.stub.calledWith(['identify', { account: { id: 'id', property: true }}]));
  });

  it('should convert a created date', function () {
    var date = new Date();
    analytics.group({ created: date });
    assert(this.stub.calledWith(['identify', { account: { created_at: unix(date) }}]));
  });
});

});

describe('Classic', function () {

var settings = {
  classic: true,
  classicMode: 'full',
  apiKey: 'mhz5Op4MUft592O8Q82MwA',
  forumId: 221539,
  tabLabel: 'test',
  defaultMode: 'feedback',
  triggerBackgroundColor: '#ff0000'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ UserVoice: settings });
  this.integration = analytics._integrations.UserVoice;
  this.options = this.integration.options;
  when(function () { return window.UserVoice.account; }, done);
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.apiKey == settings.apiKey);
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
    analytics.user().reset();
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

});