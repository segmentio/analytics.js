
describe('BugHerd', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: '7917d741-16cc-4c2b-bb1a-bdd903d53d72',
  showFeedbackTab: false
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ BugHerd: settings });
  this.integration = analytics._integrations.BugHerd;
  this.options = this.integration.options;
  when(function () { return window._bugHerd; }, done);
});

describe('#key', function () {
  it('apiKey', function () {
    assert(this.integration.key == 'apiKey');
  });
});

describe('#defaults', function () {
  it('apiKey', function () {
    assert(this.integration.defaults.apiKey === '');
  });

  it('showFeedbackTab', function () {
    assert(this.integration.defaults.showFeedbackTab === true);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.apiKey == settings.apiKey);
    assert(this.options.showFeedbackTab == settings.showFeedbackTab);
  });

  it('should hide feedback tab', function () {
    assert(equal(window.BugHerdConfig, { feedback: { hide: true }}));
  });
});

});