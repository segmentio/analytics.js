
describe('ClickTale', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , date = require('load-date')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  partitionId: 'www14',
  projectId: '19370',
  recordingRatio: '0.0089'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ ClickTale: settings });
  this.integration = analytics._integrations.ClickTale;
  this.options = this.integration.options;
  when(function () { return window.ClickTale; }, done);
});

describe('#name', function () {
  it('ClickTale', function () {
    assert(this.integration.name == 'ClickTale');
  });
});

describe('#key', function () {
  it('projectId', function () {
    assert(this.integration.key == 'projectId');
  });
});

describe('#defaults', function () {
  it('httpCdnUrl', function () {
    assert(this.integration.defaults.httpCdnUrl === 'http://s.clicktale.net/WRe0.js');
  });

  it('httpsCdnUrl', function () {
    assert(this.integration.defaults.httpsCdnUrl === '');
  });

  it('partitionId', function () {
    assert(this.integration.defaults.partitionId === '');
  });

  it('projectId', function () {
    assert(this.integration.defaults.projectId === '');
  });

  it('recordingRatio', function () {
    assert(this.integration.defaults.recordingRatio === 0.01);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.partitionId == settings.partitionId);
    assert(this.options.projectId == settings.projectId);
    assert(this.options.recordingRatio == settings.recordingRatio);
    assert(this.options.httpCdnUrl == this.integration.defaults.httpCdnUrl);
    assert(this.options.httpsCdnUrl == this.integration.defaults.httpsCdnUrl);
  });

  it('should store the load time', function () {
    assert(date.getTime() == window.WRInitTime);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.idSpy = sinon.spy(window, 'ClickTaleSetUID');
    this.traitSpy = sinon.spy(window, 'ClickTaleField');
  });

  afterEach(function () {
    this.idSpy.restore();
    this.traitSpy.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.idSpy.calledWith('id'));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.traitSpy.calledWith('trait', true));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.idSpy.calledWith('id'));
    assert(this.traitSpy.calledWith('trait', true));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window, 'ClickTaleEvent');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('event'));
  });
});

});
