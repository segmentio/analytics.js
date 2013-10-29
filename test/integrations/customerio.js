
describe('Customer.io', function () {
  this.timeout(10000);

  var settings = {
    siteId: 'x'
  };

  var assert = require('assert');
  var Customerio = require('analytics/lib/integrations/customerio');
  var customerio = new Customerio(settings);
  var equal = require('equals');
  var group = require('analytics/lib/group');
  var sinon = require('sinon');
  var user = require('analytics/lib/user');
  var when = require('when');

  describe('#name', function () {
    it('Customer.io', function () {
      assert(customerio.name == 'Customer.io');
    });
  });

  describe('#defaults', function () {
    it('siteId', function () {
      assert(customerio.defaults.siteId === '');
    });
  });

  describe('#exists', function () {
    after(function () {
      window._cio = undefined;
    });

    it('should check for window._cio', function () {
      window._cio = undefined;
      assert(!customerio.exists());
      window._cio = [];
      assert(customerio.exists());
    });
  });

  describe('#load', function () {
    it('should create window._cio.pageHasLoaded', function (done) {
      window._cio = [];
      customerio.load();
      when(function () { return window._cio.pageHasLoaded; }, done);
    });

    it('should callback', function (done) {
      customerio.load(done);
    });
  });

  describe('#initialize', function () {
    var load, global;

    beforeEach(function () {
      global = window._cio;
      window._cio = undefined;
      load = sinon.spy(customerio, 'load');
    });

    afterEach(function () {
      load.restore();
      window._cio = global;
    });

    it('should create window._cio', function () {
      customerio.initialize();
      assert(window._cio instanceof Array);
    });

    it('should call #load', function () {
      customerio.initialize();
      assert(load.called);
    });
  });

  describe('#identify', function () {
    var identify;

    beforeEach(function () {
      identify = sinon.spy(window._cio, 'identify');
    });

    afterEach(function () {
      user.reset();
      identify.restore();
    });

    it('should send an id', function () {
      customerio.identify('id', {});
      assert(identify.calledWith({ id: 'id' }));
    });

    it('should not send only traits', function () {
      customerio.identify(null, { trait: true });
      assert(!identify.called);
    });

    it('should send an id and traits', function () {
      customerio.identify('id', { trait: true });
      assert(identify.calledWith({
        id: 'id',
        trait: true
      }));
    });

    it('should convert dates', function () {
      var date = new Date();
      customerio.identify('id', { date: date });
      assert(identify.calledWith({
        id: 'id',
        date: Math.floor(date / 1000)
      }));
    });

    it('should alias created to created_at', function () {
      var date = new Date();
      customerio.identify('id', { created: date });
      assert(identify.calledWith({
        id: 'id',
        created_at: Math.floor(date / 1000)
      }));
    });
  });

  describe('#group', function () {
    var identify;

    beforeEach(function () {
      user.identify('id', {});
      identify = sinon.spy(window._cio, 'identify');
    });

    afterEach(function () {
      identify.restore();
      user.reset();
      group.reset();
    });

    it('should send an id', function () {
      customerio.group('id', {});
      assert(identify.calledWith({ id: 'id', 'Group id': 'id' }));
    });

    it('should send traits', function () {
      customerio.group(null, { trait: true });
      assert(identify.calledWith({ id: 'id', 'Group trait': true }));
    });

    it('should send an id and traits', function () {
      customerio.group('id', { trait: true });
      assert(identify.calledWith({
        id: 'id',
        'Group id': 'id',
        'Group trait': true
      }));
    });

    it('should convert dates', function () {
      var date = new Date();
      customerio.group(null, { date: date });
      assert(identify.calledWith({
        id: 'id',
        'Group date': Math.floor(date / 1000)
      }));
    });
  });

  describe('#track', function () {
    var track;

    beforeEach(function () {
      track = sinon.spy(window._cio, 'track');
    });

    afterEach(function () {
      track.restore();
    });

    it('should send an event', function () {
      customerio.track('event', {});
      assert(track.calledWith('event'));
    });

    it('should send an event and properties', function () {
      customerio.track('event', { property: true });
      assert(track.calledWith('event', { property: true }));
    });

    it('should convert dates', function () {
      var date = new Date();
      customerio.track('event', { date: date });
      assert(track.calledWith('event', {
        date: Math.floor(date / 1000)
      }));
    });
  });

});