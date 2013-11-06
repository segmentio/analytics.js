
describe('Intercom', function () {

  var assert = require('assert');
  var Intercom = require('analytics/lib/integrations/intercom');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var intercom;
  var settings = {
    appId: 'e2a1655e0444b4cb3f5e593bd35b0602aa1039ae'
  };

  beforeEach(function () {
    intercom = new Intercom(settings);
    intercom.initialize(); // noop
  });

  afterEach(function () {
    intercom.reset();
  });

  it('should have the right settings', function () {
    test(intercom)
      .name('Intercom')
      .assumesPageview()
      .readyOnLoad()
      .global('Intercom')
      .option('activator', '#IntercomDefaultWidget')
      .option('appId', '')
      .option('counter', true)
      .option('inbox', false);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      intercom.load = sinon.spy(); // prevent loading
    });

    it('should call #load', function () {
      intercom.initialize();
      assert(intercom.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.Intercom', function (done) {
      assert(!window.Intercom);
      intercom.load();
      when(function () { return window.Intercom; }, done);
    });

    it('should callback', function (done) {
      intercom.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      window.Intercom = sinon.spy();
    });

    it('should call boot the first time and update the second', function () {
      var app = settings.appId;
      intercom.identify('id');
      assert(window.Intercom.calledWith('boot', { app_id: app, user_id: 'id' }));
      intercom.identify('id');
      assert(window.Intercom.calledWith('update', { app_id: app, user_id: 'id' }));
    });

    it('should send an id and traits', function () {
      intercom.identify('id', { email: 'email@example.com' });
      assert(window.Intercom.calledWith('boot', {
        app_id: settings.appId,
        email: 'email@example.com',
        user_id: 'id'
      }));
    });

    it('should convert dates', function () {
      var date = new Date();
      intercom.identify('id', {
        created: date,
        company: { created: date }
      });
      assert(window.Intercom.calledWith('boot', {
        app_id: settings.appId,
        user_id: 'id',
        created_at: Math.floor(date / 1000),
        company: { created_at: Math.floor(date / 1000) }
      }));
    });

    it('should allow passing a user hash', function () {
      intercom.identify('id', {}, {
        Intercom: {
          userHash: 'x'
        }
      });
      assert(window.Intercom.calledWith('boot', {
        app_id: settings.appId,
        user_id: 'id',
        user_hash: 'x'
      }));
    });

    it('should allow passing increments', function () {
      intercom.identify('id', {}, {
        Intercom: {
          increments: { number: 42 }
        }
      });
      assert(window.Intercom.calledWith('boot', {
        app_id: settings.appId,
        user_id: 'id',
        increments: { number: 42 }
      }));
    });

    it('should send inbox settings', function () {
      intercom.options.inbox = true;
      intercom.identify('id');
      assert(window.Intercom.calledWith('boot', {
        app_id: settings.appId,
        user_id: 'id',
        widget: {
          activator: '#IntercomDefaultWidget',
          use_counter: true
        }
      }));
    });

    it('should allow overriding default activator', function () {
      intercom.options.inbox = true;
      intercom.options.activator = '#Intercom';
      intercom.identify('id');
      assert(window.Intercom.calledWith('boot', {
        app_id: settings.appId,
        user_id: 'id',
        widget: {
          activator: '#Intercom',
          use_counter: true
        }
      }));
    });
  });

  describe('#group', function () {
    beforeEach(function () {
      window.Intercom = sinon.spy();
    });

    it('should send an id', function () {
      intercom.group('id');
      assert(window.Intercom.calledWith('update', { company: { id: 'id' }}));
    });

    it('should send an id and properties', function () {
      intercom.group('id', { name: 'Name' });
      assert(window.Intercom.calledWith('update', {
        company: {
          id: 'id',
          name: 'Name'
        }
      }));
    });
  });

});