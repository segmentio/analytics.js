
describe('normalize', function(){

  var normalize = require('../lib/normalize');
  var list = ['Segment', 'KISSmetrics'];
  var user = require('../lib/user');
  var assert = require('assert');
  var opts;
  var msg;

  beforeEach(function(){
    msg = {};
    opts = msg.options = {};
  });

  describe('message', function(){
    it('should merge original with normalized', function(){
      msg.userId = 'user-id';
      opts.integrations = { Segment: true };
      assert.deepEqual(normalize(msg, list), {
        integrations: { Segment: true },
        userId: 'user-id',
        context: {}
      });
    });
  });

  describe('options', function(){
    it('should move all toplevel keys to the message', function(){
      var date = opts.timestamp = new Date();
      opts.anonymousId = 'anonymous-id';
      opts.integrations = { foo: 1 };
      opts.context = { context: 1 };

      var out = normalize(msg, list);
      assert.equal(out.timestamp.getTime(), date.getTime());
      assert.equal(out.anonymousId, 'anonymous-id');
      assert.deepEqual(out.integrations, { foo: 1 });
      assert.deepEqual(out.context, { context: 1 });
    });

    it('should move all other keys to context', function(){
      opts.context = { foo: 1 };
      opts.campaign = { name: 'campaign-name' };
      opts.library = 'analytics-wordpress';
      opts.traits = { trait: true };
      assert.deepEqual(normalize(msg, list), {
        integrations: {},
        context: {
          campaign: { name: 'campaign-name' },
          library: 'analytics-wordpress',
          traits: { trait: true },
          foo: 1
        }
      });
    });
  });

  describe('integrations', function(){
    describe('as options', function(){
      it('should move to .integrations', function(){
        opts.Segment = true;
        opts.KISSmetrics = false;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            Segment: true,
            KISSmetrics: false
          }
        });
      });

      it('should match integration names', function(){
        opts.segment = true;
        opts.KissMetrics = false;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            segment: true,
            KissMetrics: false
          }
        });
      });

      it('should move .All', function(){
        opts.All = true;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            All: true
          }
        });
      });

      it('should move .all', function(){
        opts.all = true;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            all: true
          }
        });
      });

      it('should not clobber', function(){
        opts.all = false;
        opts.Segment = {};
        opts.integrations = {};
        opts.integrations.all = true;
        opts.integrations.Segment = true;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            all: true,
            Segment: true
          }
        });
      });
    });

    describe('as providers', function(){
      var providers;

      beforeEach(function(){
        opts.providers = providers = {};
      });

      it('should move to .integrations', function(){
        providers.Segment = true;
        providers.KISSmetrics = false;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            Segment: true,
            KISSmetrics: false
          }
        });
      });

      it('should match integration names', function(){
        providers.segment = true;
        providers.KissMetrics = false;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            segment: true,
            KissMetrics: false
          }
        });
      });

      it('should move .All', function(){
        providers.All = true;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            All: true
          }
        });
      });

      it('should move .all', function(){
        providers.all = true;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            all: true
          }
        });
      });

      it('should not clobber booleans', function(){
        providers.all = false;
        providers.Segment = false;
        opts.integrations = {};
        opts.integrations.all = true;
        opts.integrations.Segment = true;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            all: true,
            Segment: true
          }
        });
      });

      it('should override if providers[key] is an object', function(){
        providers.Segment = {};
        opts.integrations = { Segment: true };
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            Segment: {}
          }
        });
      });
    });

    describe('as providers and options', function(){
      var providers;

      beforeEach(function(){
        opts.providers = providers = {};
      });

      it('should move to .integrations', function(){
        providers.Segment = true;
        opts.KISSmetrics = false;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            Segment: true,
            KISSmetrics: false
          }
        });
      });

      it('should prefer options object', function(){
        providers.Segment = { option: true };
        opts.Segment = true;
        assert.deepEqual(normalize(msg, list), {
          context: {},
          integrations: {
            Segment: { option: true }
          }
        });
      });
    });
  });
});