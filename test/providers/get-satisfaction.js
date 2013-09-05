
describe('Get Satisfaction', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  widgetId: 5005
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Get Satisfaction': settings });
  this.integration = analytics._integrations['Get Satisfaction'];
  this.options = this.integration.options;
  when(function () { return window.GSFN; }, done);
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
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.widgetId == settings.widgetId);
  });

  it('should append a div to the dom', function () {
    var div = document.getElementById('getsat-widget-' + settings.widgetId);
    assert(div);
  });
});

});