
describe('Preact', function () {

  var assert = require('assert');
  var equal = require('equals');
  var Preact = require('analytics/lib/integrations/preact');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var preact;
  var settings = {
    projectCode: 'x'
  };

  beforeEach(function () {
    preact = new Preact(settings);
    preact.initialize(); // noop
  });

  afterEach(function () {
    preact.reset();
  });

  it('should have the right settings', function () {
    test(preact)
      .name('Preact')
      .assumesPageview()
      .readyOnInitialize()
      .global('_lnq')
      .option('projectCode', '');
  });

  describe('#initialize', function () {
    it('should push _setCode onto the window._lnq object', function () {
      preact.initialize();
      assert(equal(window._lnq[0], ['_setCode', settings.projectCode]));
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(preact, 'load');
      preact.initialize();
      preact.load.restore();
    });

    it('should create the window._lnq object', function (done) {
      preact.load(function () {
        assert(window._lnq);
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      preact.initialize();
      window._lnq.push = sinon.spy();
    });

    it('should send an id', function () {
      preact.identify('id');
      assert(window._lnq.push.calledWith(['_setPersonData', {
        uid: 'id',
        email: undefined,
        name: undefined,
        properties: {}
      }]));
    });

    it('shouldnt send just traits', function () {
      preact.identify(null, { trait: true });
      assert(!window._lnq.push.called);
    });

    it('should send an id and traits', function () {
      preact.identify('id', { trait: true });
      assert(window._lnq.push.calledWith(['_setPersonData', {
        uid: 'id',
        email: undefined,
        name: undefined,
        properties: { trait: true }
      }]));
    });

    it('should send an email', function () {
      preact.identify('id', { email: 'name@example.com' });
      assert(window._lnq.push.calledWith(['_setPersonData', {
        uid: 'id',
        email: 'name@example.com',
        name: undefined,
        properties: { email: 'name@example.com' }
      }]));
    });

    it('should send a name', function () {
      preact.identify('id', { name: 'name' });
      assert(window._lnq.push.calledWith(['_setPersonData', {
        uid: 'id',
        email: undefined,
        name: 'name',
        properties: { name: 'name' }
      }]));
    });
  });

  describe('#group', function () {
    beforeEach(function () {
      preact.initialize();
      window._lnq.push = sinon.spy();
    });

    it('should send an id', function () {
      preact.group('id');
      assert(window._lnq.push.calledWith(['_setAccount', { id: 'id' }]));
    });

    it('should send an id and properties', function () {
      preact.group('id', { property: true });
      assert(window._lnq.push.calledWith(['_setAccount', {
        id: 'id',
        property: true
      }]));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      preact.initialize();
      window._lnq.push = sinon.spy();
    });

    it('should send an event', function () {
      preact.track('event');
      assert(window._lnq.push.calledWith(['_logEvent', { name: 'event' }, {}]));
    });

    it('should send an event and properties', function () {
      preact.track('event', { property: true });
      assert(window._lnq.push.calledWith(['_logEvent', { name: 'event' }, { property: true }]));
    });

    it('should special case a revenue property', function () {
      preact.track('event', { revenue: 9.99 });
      assert(window._lnq.push.calledWith(['_logEvent', {
        name: 'event',
        revenue: 999
      }, {}]));
    });

    it('should special case a note property', function () {
      preact.track('event', { note: 'note' });
      assert(window._lnq.push.calledWith(['_logEvent', {
        name: 'event',
        note: 'note'
      }, {}]));
    });
  });
});