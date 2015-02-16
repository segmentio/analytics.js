
describe('normalize', function(){

  var normalize = require('../lib/normalize')(['Segment', 'KISSmetrics']);
  var user = require('../lib/user');
  var assert = require('assert');
  var opts;
  var msg;

  beforeEach(function(){
    msg = { options: opts = {} };
  });

  describe('message', function(){
    it('should merge original with normalized', function(){
      msg.userId = 'user-id';
      opts.integrations = { Segment: true };
      assert.deepEqual(normalize(msg), {
        integrations: { Segment: true },
        userId: 'user-id',
        context: {}
      });
    });
  });

  describe('options', function(){
    it('should move all toplevel keys to the message', function(){
      opts.timestamp = new Date('2015');
      opts.anonymousId = 'anonymous-id';
      opts.category = 'category';
      opts.name = 'name';
      opts.event = 'event';
      opts.userId = 'user-id';
      opts.groupId = 'group-id';
      opts.integrations = { foo: 1 };
      opts.properties = { prop: 1 };
      opts.traits = { trait: 1 };
      opts.previousId = 'previous-id';
      opts.context = { context: 1 };
      assert.deepEqual(normalize(msg), {
        timestamp: new Date('2015'),
        anonymousId: 'anonymous-id',
        category: 'category',
        name: 'name',
        event: 'event',
        userId: 'user-id',
        groupId: 'group-id',
        integrations: { foo: 1 },
        properties: { prop: 1 },
        traits: { trait: 1 },
        previousId: 'previous-id',
        context: { context: 1 }
      });
    });

    it('should move all other keys to context', function(){
      opts.context = { foo: 1 };
      opts.campaign = { name: 'campaign-name' };
      opts.library = 'analytics-wordpress';
      assert.deepEqual(normalize(msg), {
        integrations: {},
        context: {
          campaign: { name: 'campaign-name' },
          library: 'analytics-wordpress',
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
        assert.deepEqual(normalize(msg), {
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
        assert.deepEqual(normalize(msg), {
          context: {},
          integrations: {
            segment: true,
            KissMetrics: false
          }
        });
      });

      it('should move .All', function(){
        opts.All = true;
        assert.deepEqual(normalize(msg), {
          context: {},
          integrations: {
            All: true
          }
        });
      });

      it('should move .all', function(){
        opts.all = true;
        assert.deepEqual(normalize(msg), {
          context: {},
          integrations: {
            all: true
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
        assert.deepEqual(normalize(msg), {
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
        assert.deepEqual(normalize(msg), {
          context: {},
          integrations: {
            segment: true,
            KissMetrics: false
          }
        });
      });

      it('should move .All', function(){
        providers.All = true;
        assert.deepEqual(normalize(msg), {
          context: {},
          integrations: {
            All: true
          }
        });
      });

      it('should move .all', function(){
        providers.all = true;
        assert.deepEqual(normalize(msg), {
          context: {},
          integrations: {
            all: true
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
        assert.deepEqual(normalize(msg), {
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
        assert.deepEqual(normalize(msg), {
          context: {},
          integrations: {
            Segment: { option: true },
          }
        });
      });
    });
  });
});