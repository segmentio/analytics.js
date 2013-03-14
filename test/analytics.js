
describe('Analytics.js', function () {

  var type = require('component-type');

  var readyTimeout = 42;

  var Provider = analytics.Provider.extend({
    key        : 'key',
    options    : {},
    initialize : function (options, ready) {
      setTimeout(ready, readyTimeout);
    },
    identify   : function (userId, traits) {},
    track      : function (event, properties) {},
    pageview   : function () {},
    alias      : function (newId, originalId) {}
  });
  analytics.addProvider('Test', Provider);

  var options = { 'Test' : 'x' };

  // Make sure initialize runs, so that any test can be looked at individually.
  analytics.initialize(options);



  describe('initialize', function () {

    it('stores enabled providers', function () {
      analytics.providers = [];
      analytics.initialize(options);
      expect(analytics.providers[0] instanceof Provider).to.be(true);
    });

    it('sends options to enabled providers initialize', function () {
      var spy = sinon.spy(Provider.prototype, 'initialize');
      analytics.initialize(options);
      expect(spy.calledWith(sinon.match({ key : 'x' }))).to.be(true);
      spy.restore();
    });

    it('resets enabled providers', function () {
      analytics.initialize(options);
      expect(analytics.providers.length).to.equal(1);
      analytics.initialize(options);
      expect(analytics.providers.length).to.equal(1);
    });
  });



  describe('ready', function () {


    it('calls callbacks on initialize after a timeout', function (done) {
      // Turn off our current initialized state.
      analytics.initialized = false;

      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      analytics.ready(spy1);
      analytics.ready(spy2);
      expect(spy1.called).to.be(false);
      expect(spy2.called).to.be(false);

      analytics.initialize(options);
      expect(spy1.called).to.be(false);
      expect(spy2.called).to.be(false);

      setTimeout(function () {
        expect(spy1.called).to.be(true);
        expect(spy2.called).to.be(true);
        done();
      }, readyTimeout + 10);
    });

    it('sets ready state', function () {
      analytics.initialize(options);
      expect(analytics.isReady).to.be(false);
      analytics.ready(function () {
        expect(analytics.isReady).to.be(true);
      });
    });

    it('resets ready state (after initialize)', function (done) {
      analytics.initialize(options);
      analytics.ready(function () {
        expect(analytics.isReady).to.be(true);
        analytics.initialize(options);
        expect(analytics.isReady).to.be(false);

        // Wait for it to come back to not interleave next tests.
        analytics.ready(done);
      });
    });

    it('calls callbacks immediately when already ready', function () {
      var spy = sinon.spy();
      analytics.ready(spy);
      expect(spy.called).to.be(true);
    });

    it('doesnt break on being passed a non-function', function () {
      expect(function () {
        analytics.ready('callback');
      }).to.not.throwException();
    });
  });



  describe('queue', function () {

    // Describes a single test of the queue against a particular method.
    var queueTest = function (method, args) {
      return function (done) {
        // Reset our initialized function
        analytics.initialized = false;
        var spy = sinon.spy(Provider.prototype, 'enqueue');

        analytics.initialize(options);

        // Once initialized, the call should queue.
        analytics[method].apply(analytics, args);
        expect(spy.firstCall.args).to.eql([method, args]);
        spy.restore();

        // After a timeout, expect the queue to drain.
        spy = sinon.spy(Provider.prototype, method);
        setTimeout(function () {
          expect(spy.firstCall.args).to.eql(args);
          spy.restore();
          done();
        }, readyTimeout + 10);
      };
    };

    it('queues track calls before ready is called',
      queueTest('track', ['tossed a disc', { distance : 40 }, undefined])
    );

    it('queues identify calls before ready is called',
      queueTest('identify', ['id', { name : 'achilles' }, undefined])
    );

    it('queues alias calls before ready is called',
      queueTest('alias', ['id', 'newId'])
    );

    it('queues pageview calls before ready is called',
      queueTest('pageview', ['/some/url'])
    );
  });


  // Identify
  // --------

  describe('identify', function () {

    it('is called on providers', function () {
      var spy = sinon.spy(Provider.prototype, 'identify');
      analytics.identify();
      expect(spy.called).to.be(true);
      spy.restore();
    });

    it('sends userId along', function () {
      var spy = sinon.spy(Provider.prototype, 'identify');
      analytics.identify(test.userId);
      expect(spy.calledWith(test.userId));
      spy.restore();
    });

    it('sends a clone of traits along', function  () {
      var spy = sinon.spy(Provider.prototype, 'identify');
      analytics.identify(test.userId, test.traits);
      expect(spy.args[0][1]).not.to.equal(test.traits);
      expect(spy.args[0][1]).to.eql(test.traits);
      spy.restore();
    });

    it('sends a clone of context along', function  () {
      var spy = sinon.spy(Provider.prototype, 'identify');
      analytics.identify(test.userId, test.traits, test.context);
      expect(spy.args[0][2]).not.to.equal(test.context);
      expect(spy.args[0][2]).to.eql(test.context);
      spy.restore();
    });

    it('calls the callback after the timeout duration', function (done) {
      var callback = sinon.spy();

      analytics.identify(test.userId, test.traits, callback);
      expect(callback.called).to.be(false);

      setTimeout(function () {
        expect(callback.called).to.be(true);
        done();
      }, analytics.timeout);
    });

    it('takes a callback with optional traits, userId or context', function (done) {
      var callback = sinon.spy();

      analytics.identify(test.userId, callback);
      analytics.identify(test.traits, callback);
      analytics.identify(test.userId, test.traits, callback);
      analytics.identify(test.userId, test.traits, test.context, callback);

      setTimeout(function () {
        expect(callback.callCount).to.be(4);
        done();
      }, analytics.timeout);
    });

    it('is turned off by the all providers flag', function  () {
      var spy     = sinon.spy(Provider.prototype, 'identify')
        , context = {
            providers: { all: false }
          };

      analytics.identify(test.userId, test.traits, context);
      expect(spy.called).to.be(false);
      spy.restore();
    });

    it('is turned off by the single provider flag', function  () {
      var spy     = sinon.spy(Provider.prototype, 'identify')
        , context = {
            providers: { Test: false }
          };

      analytics.identify(test.userId, test.traits, context);
      expect(spy.called).to.be(false);
      spy.restore();
    });

    it('parses valid strings into dates', function () {
      var spy  = sinon.spy(Provider.prototype, 'identify')
        , date = 'Dec 07 12';
      analytics.identify({
        created : date,
        company : {
          created : date
        }
      });
      var traits = spy.args[0][1];
      expect(type(traits.created)).to.equal('date');
      expect(traits.created.getTime()).to.equal(new Date(date).getTime());
      expect(traits.company.created.getTime()).to.equal(new Date(date).getTime());
      spy.restore();
    });

    it('keeps normal dates the same', function () {
      var spy  = sinon.spy(Provider.prototype, 'identify')
        , date = new Date();
      analytics.identify({
        created : date,
        company : {
          created : date
        }
      });
      var traits = spy.args[0][1];
      expect(traits.created.getTime()).to.equal(date.getTime());
      expect(traits.company.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    it('parses seconds into dates', function () {
      var spy  = sinon.spy(Provider.prototype, 'identify')
        , date = new Date()
        , seconds = date.getTime()/1000;
      analytics.identify({
        created : seconds,
        company : {
          created : seconds
        }
      });
      var traits = spy.args[0][1];
      expect(traits.created.getTime()).to.equal(date.getTime());
      expect(traits.company.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    it('parses milliseconds into dates', function () {
      var spy  = sinon.spy(Provider.prototype, 'identify')
        , date = new Date()
        , milliseconds = date.getTime();
      analytics.identify({
        created : milliseconds,
        company : {
          created : milliseconds
        }
      });
      var traits = spy.args[0][1];
      expect(traits.created.getTime()).to.equal(date.getTime());
      expect(traits.company.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    /* TODO: re-enable when we fix the mixpanel logging an error
    it('calls alias when identifying from anonymous users', function () {
      var spy = sinon.spy(Provider.prototype, 'alias');

      analytics.user.clear();

      var userId = 'id'
        , traits = {
            age  : 23,
            name : 'Achilles'
          };

      analytics.identify(userId, traits);
      expect(spy.called).to.be(true);

      spy.restore();
    });

    it('does not call alias when identifying another user', function () {
      var spy = sinon.spy(Provider.prototype, 'alias');

      var userId = 'newId'
        , traits = {
            age  : 23,
            name : 'Achilles'
          };

      analytics.identify(userId, traits);
      expect(spy.called).to.be(false);

      spy.restore();
    });*/

  });



  describe('track', function () {

    it('is called on providers', function () {
      var spy = sinon.spy(Provider.prototype, 'track');
      analytics.track();
      expect(spy.called).to.be(true);
      spy.restore();
    });

    it('sends event name along', function () {
      var spy = sinon.spy(Provider.prototype, 'track');
      analytics.track('party');
      expect(spy.calledWith('party')).to.be(true);
      spy.restore();
    });

    it('sends a clone of properties along', function  () {
      var spy = sinon.spy(Provider.prototype, 'track');
      analytics.track('party', test.properties);
      expect(spy.args[0][1]).not.to.equal(test.properties);
      expect(spy.args[0][1]).to.eql(test.properties);
      spy.restore();
    });

    it('sends a clone of context along', function  () {
      var spy = sinon.spy(Provider.prototype, 'track');
      analytics.track(test.eventName, test.properties, test.context);
      expect(spy.args[0][2]).not.to.equal(test.context);
      expect(spy.args[0][2]).to.eql(test.context);
      spy.restore();
    });

    it('calls the callback after the timeout duration', function (done) {
      var callback = sinon.spy();

      analytics.track(test.event, test.properties, callback);
      expect(callback.called).to.be(false);

      setTimeout(function () {
        expect(callback.called).to.be(true);
        done();
      }, analytics.timeout);
    });

    it('takes a callback with optional eventName, propertes or context', function (done) {
      var callback = sinon.spy();

      analytics.identify(test.userId, callback);
      analytics.identify(test.traits, callback);
      analytics.identify(test.userId, test.traits, callback);
      analytics.identify(test.userId, test.traits, test.context, callback);

      setTimeout(function () {
        expect(callback.callCount).to.be(4);
        done();
      }, analytics.timeout);
    });
  });



  describe('trackLink', function () {

    it('triggers a track on a link click', function () {
      var spy  = sinon.spy(Provider.prototype, 'track')
        , link = $('<a>')[0];

      analytics.trackLink(link, 'party');
      triggerClick(link);
      expect(spy.calledWith('party')).to.be(true);
      spy.restore();
    });

    it('triggers a track on a $link click', function () {
      var spy   = sinon.spy(Provider.prototype, 'track')
        , $link = $('<a>');

      analytics.trackLink($link, 'party');
      triggerClick($link[0]);
      expect(spy.calledWith('party')).to.be(true);
      spy.restore();
    });

    it('allows for properties to be a function', function () {
      var spy  = sinon.spy(Provider.prototype, 'track')
        , link = $('<a>')[0];

      analytics.trackLink(link, 'party', function () {
        return { type : 'crazy' };
      });

      triggerClick(link);
      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);
      spy.restore();
    });

    it('allows for properties to be a function across multiple links', function () {
      var spy   = sinon.spy(Provider.prototype, 'track')
        , links = $('<a data-type="crazy"><a data-type="normal">');

      var handler = function (link) {
        return { type : $(link).attr('data-type') };
      };

      analytics.trackLink(links, 'party', handler);

      triggerClick(links[0]);
      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);
      spy.reset();

      triggerClick(links[1]);
      expect(spy.calledWith('party', { type : 'normal' })).to.be(true);
      spy.restore();
    });

    it('calls a properties function with the link that was clicked', function () {
      var spy  = sinon.spy()
        , link = $('<a>')[0];

      analytics.trackLink(link, 'party', spy);
      triggerClick(link);
      expect(spy.calledWith(link)).to.be(true);
    });

    it('triggers a track and loads an href on a link click with an href', function (done) {
      var spy  = sinon.spy(Provider.prototype, 'track')
        , link = $('<a href="#test">')[0];

      // Make sure hash is reset.
      window.location.hash = '';

      analytics.trackLink(link, 'party');
      triggerClick(link);

      // Expect the track call to have happened, but for the href not to have
      // been applied yet.
      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test');

      // Expect the href to be applied after the timeout that gives events
      // time to send requests.
      setTimeout(function () {
        expect(window.location.hash).to.equal('#test');
        spy.restore();
        done();
      }, analytics.timeout);
    });

    it('triggers a track and loads the correct href on a link click with multiple links', function (done) {
      var spy   = sinon.spy(Provider.prototype, 'track')
        , link1 = $('<a href="#test1">')[0]
        , link2 = $('<a href="#test2">')[0]
        , link3 = $('<a href="#test3">')[0];

      // Make sure hash is reset.
      window.location.hash = '';

      analytics.trackLink([link1, link2, link3], 'party');
      triggerClick(link2);

      // Expect the track call to have happened, but for the href not to have
      // been applied yet.
      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test2');

      // Expect the href to be applied after the timeout that gives events
      // time to send requests.
      setTimeout(function () {
        expect(window.location.hash).to.equal('#test2');
        spy.restore();
        done();
      }, analytics.timeout);
    });

    it('triggers a track but doesnt load an href on an href with blank target', function () {
      var spy  = sinon.spy(Provider.prototype, 'track')
        , link = $('<a href="http://google.com" target="_blank">')[0];

      // Make sure hash is reset.
      window.location.hash = '';

      analytics.trackLink(link, 'party');
      triggerClick(link);
      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test');
      spy.restore();
    });

    it('triggers a track but doesnt load an href on a meta link click with an href', function () {
      var spy  = sinon.spy(Provider.prototype, 'track')
        , link = $('<a href="http://google.com">')[0];

      // Make sure hash is reset.
      window.location.hash = '';

      analytics.trackLink(link, 'party');
      triggerClick(link, true);
      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test');
      spy.restore();
    });

    it('trackClick is aliased to trackLink for backwards compatibility', function () {
      expect(analytics.trackClick).to.equal(analytics.trackLink);
    });
  });



  describe('trackForm', function () {

    var template = '<form action="http://google.com" target="_blank"><input type="submit" /></form>';

    it('triggers a track on a form submit', function () {
      var spy  = sinon.spy(Provider.prototype, 'track')
        , form = $(template)[0];

      analytics.trackForm(form, 'party');
      triggerClick($(form).find('input')[0]);
      expect(spy.calledWith('party')).to.be(true);
      spy.restore();
    });

    it('triggers a track on a $form submit', function () {
      var spy   = sinon.spy(Provider.prototype, 'track')
        , $form = $(template);

      analytics.trackForm($form, 'party');
      triggerClick($form.find('input')[0]);
      expect(spy.calledWith('party')).to.be(true);
      spy.restore();
    });

    it('triggers a track on a $form submitted by jQuery', function () {
      var spy   = sinon.spy(Provider.prototype, 'track')
        , $form = $(template);

      analytics.trackForm($form, 'party');
      $form.submit();
      expect(spy.calledWith('party')).to.be(true);
      spy.restore();
    });

    it('allows for properties to be a function', function () {
      var spy  = sinon.spy(Provider.prototype, 'track')
        , form = $(template)[0];

      analytics.trackForm(form, 'party', function () {
          return { type : 'crazy' };
      });

      triggerClick($(form).find('input')[0]);
      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);
      spy.restore();
    });

    it('calls a properties function with the form that was clicked', function () {
      var spy  = sinon.spy()
        , form = $(template)[0];

      analytics.trackForm(form, 'party', spy);
      triggerClick($(form).find('input')[0]);
      expect(spy.calledWith(form)).to.be(true);
    });

    it('trackSubmit is aliased to trackForm for backwards compatibility', function () {
      expect(analytics.trackSubmit).to.equal(analytics.trackForm);
    });
  });



  describe('pageview', function () {

    it('gets called on providers', function () {
      var spy = sinon.spy(Provider.prototype, 'pageview');
      analytics.pageview();
      expect(spy.called).to.be(true);
      spy.restore();
    });
  });



  describe('alias', function () {

    it('gets called on providers', function () {
      var spy = sinon.spy(Provider.prototype, 'alias');
      analytics.alias();
      expect(spy.called).to.be(true);
      spy.restore();
    });
  });

});


// Helper to trigger true DOM click events in all browser ... and IE. Believe it
// or not `initMouseEvent` isn't even an IE thing:
// https://developer.mozilla.org/en-US/docs/DOM/event.initMouseEvent
function triggerClick (element, isMeta) {
  var e;
  if (document.createEvent) {
    e = document.createEvent('MouseEvent');
    if (isMeta)
      e.initMouseEvent('click', true, true, window,
                       1, 0, 0, 0, 0,
                       true, true, true, true,
                       0, null);
    else
      e.initMouseEvent('click', true, true, window,
                       1, 0, 0, 0, 0,
                       false, false, false, false,
                       0, null);
    element.dispatchEvent(e);
  } else {
    if (isMeta) {
      e = document.createEventObject({
        altKey   : true,
        ctrlKey  : true,
        shiftKey : true
      });
    }
    element.fireEvent('onClick', e);
  }
}