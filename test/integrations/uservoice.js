
describe('UserVoice', function () {

  var UserVoice = require('analytics/lib/integrations/uservoice');
  var assert = require('assert');
  var jQuery = require('jquery');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var unix = require('to-unix-timestamp');
  var when = require('when');

  var uservoice;
  var settings = {
    apiKey: 'EvAljSeJvWrrIidgVvI2g'
  };

  beforeEach(function () {
    uservoice = new UserVoice(settings);
  });

  afterEach(function () {
    uservoice.restore();
  });

  it('should store the right settings', function () {
    test('UserVoice')
      .assumesPageview()
      .readyOnInitialize()
      .global('UserVoice')
      .option('apiKey', '')
      .option('classic', false)
      .option('forumId', null)
      .option('showWidget', true)
      .option('mode', 'contact')
      .option('accentColor', '#448dd6')
      .option('trigger', null)
      .option('triggerPosition', 'bottom-right')
      .option('triggerColor', '#ffffff')
      .option('triggerBackgroundColor', 'rgba(46, 49, 51, 0.6)')
      // BACKWARDS COMPATIBILITY: classic options
      .option('classicMode', 'full')
      .option('primaryColor', '#cc6d00')
      .option('linkColor', '#007dbf')
      .option('defaultMode', 'support')
      .option('tabLabel', 'Feedback & Support')
      .option('tabColor', '#cc6d00')
      .option('tabPosition', 'middle-right')
      .option('tabInverted', false);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      uservoice.load = sinon.spy();
    });

    it('should call load', function () {
      uservoice.initialize();
      assert(uservoice.load.called);
    });

    it('should use identifyClassic if set to classic', function () {
    });

    it('should not have a group method if set to classic', function () {
    });

    it('should push the setup arguments onto the window.UserVoice object', function () {

    });


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