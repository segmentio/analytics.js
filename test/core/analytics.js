describe('Analytics.js', function () {

  var analytics = window.analytics || require('analytics')
    , trigger = require('trigger-event')
    , integration = require('analytics/lib/integration')
    , group = require('analytics/lib/group');

  // lower timeout for tests
  var timeout = analytics._timeout = 3;

  var Integration = integration('Test');
  Integration.prototype.key = 'key';
  Integration.prototype.defaults = {};
  Integration.prototype.initialize = function (options, ready) {
    setTimeout(ready, timeout);
  };
  Integration.prototype.identify = function (userId, traits) {};
  Integration.prototype.group = function (groupId, properties) {};
  Integration.prototype.track = function (event, properties) {};
  Integration.prototype.pageview = function () {};
  Integration.prototype.alias = function (newId, originalId) {};

  analytics.integration(Integration);

  var options = { 'Test' : 'x' };

  // Make sure initialize runs, so that any test can be looked at individually.
  analytics.initialize(options);



  describe('initialize', function () {
    it('stores enabled integrations', function () {
      analytics._integrations = [];
      analytics.initialize(options);
      expect(analytics._integrations.Test instanceof Integration).to.be(true);
    });

    it('doesnt error on unknown integration', function () {
      expect(function () {
        analytics.initialize({ 'Unknown' : '' });
      }).not.to.throwException();
    });

    it('sends options to integration.initialize', function () {
      var spy = sinon.spy(Integration.prototype, 'initialize');
      analytics.initialize(options);
      expect(spy.calledWith(sinon.match({ key : 'x' }))).to.be(true);
      spy.restore();
    });
  });



  describe('ready', function () {

    before(function () {
      // Turn off our current ready state.
      analytics._readied = false;
    });

    it('calls callbacks on initialize after a timeout', function (done) {
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
      }, timeout);
    });

    it('sets ready state', function (done) {
      analytics.initialize(options);
      analytics.ready(function () {
        expect(analytics._readied).to.be(true);
        done();
      });
    });

    it('calls backs on next tick when already ready', function (done) {
      var spy = sinon.spy();
      analytics.ready(spy);
      setTimeout(function () {
        expect(spy.called).to.be(true);
        done();
      }, 1);
    });

    it('doesnt break on being passed a non-function', function () {
      expect(function () {
        analytics.ready('callback');
      }).to.not.throwException();
    });
  });



  describe('queue', function () {

    function queueTest (method, args) {
      return function (done) {
        analytics._user.clear();
        analytics.initialize(options);

        // Once initialized, the call should queue.
        var enqueueSpy = sinon.spy(Integration.prototype, 'enqueue');
        analytics[method].apply(analytics, args);
        expect(enqueueSpy.firstCall.args).to.eql([method, args]);
        enqueueSpy.restore();

        // After a timeout, expect the queue to drain.
        var methodSpy = sinon.spy(Integration.prototype, method);
        setTimeout(function () {
          expect(methodSpy.firstCall.args).to.eql(args);
          methodSpy.restore();
          done();
        }, timeout);
      };
    }

    it('queues track calls before ready is called',
      queueTest('track', ['tossed a disc', { distance : 40 }, undefined])
    );

    it('queues identify calls before ready is called',
      queueTest('identify', ['id', { name : 'achilles' }, undefined])
    );

    it('queues alias calls before ready is called',
      queueTest('alias', ['id', 'newId', undefined])
    );

    it('queues pageview calls before ready is called',
      queueTest('pageview', ['/some/url', undefined])
    );
  });



  describe('identify', function () {

    it('is called on providers', function () {
      var spy = sinon.spy(Integration.prototype, 'identify');
      analytics.identify();
      expect(spy.called).to.be(true);
      spy.restore();
    });

    it('sends userId along', function () {
      var spy = sinon.spy(Integration.prototype, 'identify');
      analytics.identify(test.userId);
      expect(spy.calledWith(test.userId));
      spy.restore();
    });

    it('sends a clone of traits along', function  () {
      var spy = sinon.spy(Integration.prototype, 'identify');
      analytics.identify(test.userId, test.traits);
      expect(spy.args[0][1]).not.to.equal(test.traits);
      expect(spy.args[0][1]).to.eql(test.traits);
      spy.restore();
    });

    it('sends a clone of context along', function  () {
      var spy = sinon.spy(Integration.prototype, 'identify');
      analytics.identify(test.userId, test.traits, test.context);
      expect(spy.args[0][2]).not.to.equal(test.context);
      expect(spy.args[0][2]).to.eql(test.context);
      spy.restore();
    });

    it('calls back after the timeout duration', function (done) {
      var callback = sinon.spy();

      analytics.identify(test.userId, test.traits, callback);
      expect(callback.called).to.be(false);

      setTimeout(function () {
        expect(callback.called).to.be(true);
        done();
      }, timeout);
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
      }, timeout);
    });

    it('is turned off by the all providers flag', function  () {
      var spy     = sinon.spy(Integration.prototype, 'identify')
        , context = {
            providers: { all: false }
          };

      analytics.identify(test.userId, test.traits, context);
      expect(spy.called).to.be(false);
      spy.restore();
    });

    it('is turned off by the single integration flag', function  () {
      var spy     = sinon.spy(Integration.prototype, 'identify')
        , context = {
            providers: { Test: false }
          };

      analytics.identify(test.userId, test.traits, context);
      expect(spy.called).to.be(false);
      spy.restore();
    });

    it('parses valid strings into dates', function () {
      var type = require('component-type')
        , spy  = sinon.spy(Integration.prototype, 'identify')
        , date = 'Dec 07 2012';

      analytics.identify({
        created : date,
        company : { created : date }
      });

      var traits = spy.args[0][1];
      expect(type(traits.created)).to.equal('date');
      expect(traits.created.getTime()).to.equal(new Date(date).getTime());
      expect(traits.company.created.getTime()).to.equal(new Date(date).getTime());
      spy.restore();
    });

    it('keeps normal dates the same', function () {
      var spy  = sinon.spy(Integration.prototype, 'identify')
        , date = new Date();

      analytics.identify({
        created : date,
        company : { created : date }
      });

      var traits = spy.args[0][1];
      expect(traits.created.getTime()).to.equal(date.getTime());
      expect(traits.company.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    it('parses seconds into dates', function () {
      var spy     = sinon.spy(Integration.prototype, 'identify')
        , date    = new Date()
        , seconds = date.getTime()/1000;

      analytics.identify({
        created : seconds,
        company : { created : seconds }
      });

      var traits = spy.args[0][1];
      expect(traits.created.getTime()).to.equal(date.getTime());
      expect(traits.company.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    it('parses milliseconds into dates', function () {
      var spy          = sinon.spy(Integration.prototype, 'identify')
        , date         = new Date()
        , milliseconds = date.getTime();

      analytics.identify({
        created : milliseconds,
        company : { created : milliseconds }
      });

      var traits = spy.args[0][1];
      expect(traits.created.getTime()).to.equal(date.getTime());
      expect(traits.company.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    it('calls with all stored traits', function () {
      analytics._user.clear();
      var spy    = sinon.spy(Integration.prototype, 'identify')
        , traits = test.traits;

      analytics.identify({ name : traits.name });
      expect(spy.calledWith(null, { name : traits.name })).to.be(true);
      spy.reset();

      analytics.identify({ email : traits.email });
      expect(spy.calledWith(null, {
        name  : traits.name,
        email : traits.email
      })).to.be(true);
      spy.reset();

      analytics.identify(test.userId);
      expect(spy.calledWith(test.userId, {
        name  : traits.name,
        email : traits.email
      })).to.be(true);
      spy.restore();
    });


    it('overwrites stored traits', function () {
      analytics._user.clear();
      var spy    = sinon.spy(Integration.prototype, 'identify')
        , traits = {
            name : 'Zeus',
            email : 'zeus@email.com'
          };

      analytics.identify(test.userId, traits);
      expect(spy.calledWith(test.userId, traits)).to.be(true);
      spy.reset();

      analytics.identify({ name : 'Poseidon' });
      traits.name = 'Poseidon';
      expect(spy.calledWith(test.userId, traits)).to.be(true);
      spy.restore();
    });
  });



  describe('group', function () {

    it('should return the group singleton', function () {
      expect(analytics.group()).to.equal(group);
    });

    it('is called on providers', function () {
      var spy = sinon.spy(Integration.prototype, 'group');
      analytics.group('id');
      expect(spy.called).to.be(true);
      spy.restore();
    });

    it('sends groupId along', function () {
      var spy = sinon.spy(Integration.prototype, 'group');
      analytics.group(test.groupId);
      expect(spy.calledWith(test.groupId));
      spy.restore();
    });

    it('sends a clone of properties along', function  () {
      var spy = sinon.spy(Integration.prototype, 'group');
      analytics.group(test.groupId, test.groupProperties);
      expect(spy.args[0][1]).not.to.equal(test.groupProperties);
      expect(spy.args[0][1]).to.eql(test.groupProperties);
      spy.restore();
    });

    it('sends a clone of context along', function  () {
      var spy = sinon.spy(Integration.prototype, 'group');
      analytics.group(test.groupId, test.groupProperties, test.context);
      expect(spy.args[0][2]).not.to.equal(test.context);
      expect(spy.args[0][2]).to.eql(test.context);
      spy.restore();
    });

    it('calls the callback after the timeout duration', function (done) {
      var callback = sinon.spy();

      analytics.group(test.groupId, test.groupProperties, callback);
      expect(callback.called).to.be(false);

      setTimeout(function () {
        expect(callback.called).to.be(true);
        done();
      }, timeout);
    });

    it('takes a callback with optional properties or context', function (done) {
      var callback = sinon.spy();

      analytics.group(test.groupId, callback);
      analytics.group(test.groupId, test.groupProperties, callback);
      analytics.group(test.groupId, test.groupProperties, test.context, callback);

      setTimeout(function () {
        expect(callback.callCount).to.be(3);
        done();
      }, timeout);
    });

    it('is turned off by the all providers flag', function  () {
      var spy     = sinon.spy(Integration.prototype, 'group')
        , context = { providers: { all: false } };

      analytics.group(test.groupId, test.group, context);
      expect(spy.called).to.be(false);
      spy.restore();
    });

    it('is turned off by the single integration flag', function  () {
      var spy     = sinon.spy(Integration.prototype, 'group')
        , context = { providers: { Test: false } };

      analytics.group(test.groupId, test.group, context);
      expect(spy.called).to.be(false);
      spy.restore();
    });

    it('parses valid strings into dates', function () {
      var type = require('component-type')
        , spy  = sinon.spy(Integration.prototype, 'group')
        , date = 'Dec 07 2012';

      analytics.group(test.groupId, { created : date });

      var properties = spy.args[0][1];
      expect(type(properties.created)).to.equal('date');
      expect(properties.created.getTime()).to.equal(new Date(date).getTime());
      spy.restore();
    });

    it('keeps normal dates the same', function () {
      var spy  = sinon.spy(Integration.prototype, 'group')
        , date = new Date();

      analytics.group(test.groupId, { created : date });

      var properties = spy.args[0][1];
      expect(properties.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    it('parses seconds into dates', function () {
      var spy     = sinon.spy(Integration.prototype, 'group')
        , date    = new Date()
        , seconds = date.getTime()/1000;

      analytics.group(test.groupId, { created : seconds });

      var properties = spy.args[0][1];
      expect(properties.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });

    it('parses milliseconds into dates', function () {
      var spy          = sinon.spy(Integration.prototype, 'group')
        , date         = new Date()
        , milliseconds = date.getTime();

      analytics.group(test.groupId, { created : milliseconds });

      var properties = spy.args[0][1];
      expect(properties.created.getTime()).to.equal(date.getTime());
      spy.restore();
    });
  });



  describe('track', function () {

    it('is called on providers', function () {
      var spy = sinon.spy(Integration.prototype, 'track');
      analytics.track();
      expect(spy.called).to.be(true);
      spy.restore();
    });

    it('sends event name along', function () {
      var spy = sinon.spy(Integration.prototype, 'track');
      analytics.track('party');
      expect(spy.calledWith('party')).to.be(true);
      spy.restore();
    });

    it('sends a clone of properties along', function  () {
      var spy = sinon.spy(Integration.prototype, 'track');
      analytics.track('party', test.properties);
      expect(spy.args[0][1]).not.to.equal(test.properties);
      expect(spy.args[0][1]).to.eql(test.properties);
      spy.restore();
    });

    it('sends a clone of context along', function  () {
      var spy = sinon.spy(Integration.prototype, 'track');
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
      }, timeout);
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
      }, timeout);
    });
  });



  describe('trackLink', function () {

    var spy;

    beforeEach(function () {
      spy = sinon.spy(Integration.prototype, 'track');
      window.location.hash = '';
    });

    afterEach(function () {
      spy.restore();
    });

    it('triggers a track on a link click', function () {
      var a = document.createElement('a');
      analytics.trackLink(a, 'party');
      trigger(a, 'click');
      expect(spy.calledWith('party')).to.be(true);
    });

    it('triggers a track on a $link click', function () {
      var $link = $('<a>');
      analytics.trackLink($link, 'party');
      trigger($link[0], 'click');
      expect(spy.calledWith('party')).to.be(true);
    });

    it('allows for event to be a function', function () {
      var link = $('<a>')[0];
      analytics.trackLink(link, function () { return 'party'; });
      trigger(link, 'click');
      expect(spy.calledWith('party')).to.be(true);
    });

    it('allows for event to be a function across multiple links', function () {
      var links = $('<a data-type="crazy"><a data-type="normal">');
      var handler = function (link) { return $(link).attr('data-type'); };
      analytics.trackLink(links, handler);
      trigger(links[0], 'click');
      expect(spy.calledWith('crazy')).to.be(true);
      spy.reset();
      trigger(links[1], 'click');
      expect(spy.calledWith('normal')).to.be(true);
    });

    it('calls a event function with the link that was clicked', function () {
      var spy  = sinon.spy()
        , link = $('<a>')[0];
      analytics.trackLink(link, spy);
      trigger(link, 'click');
      expect(spy.calledWith(link)).to.be(true);
    });

    it('allows for properties to be a function', function () {
      var link = $('<a>')[0];
      analytics.trackLink(link, 'party', function () {
        return { type : 'crazy' };
      });
      trigger(link, 'click');
      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);
    });

    it('allows for properties to be a function across multiple links', function () {
      var links = $('<a data-type="crazy"><a data-type="normal">');
      var handler = function (link) {
        return { type : $(link).attr('data-type') };
      };
      analytics.trackLink(links, 'party', handler);
      trigger(links[0], 'click');
      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);
      spy.reset();
      trigger(links[1], 'click');
      expect(spy.calledWith('party', { type : 'normal' })).to.be(true);
    });

    it('calls a properties function with the link that was clicked', function () {
      var spy  = sinon.spy()
        , link = $('<a>')[0];
      analytics.trackLink(link, 'party', spy);
      trigger(link, 'click');
      expect(spy.calledWith(link)).to.be(true);
    });

    it('triggers a track and loads an href on a link click with an href', function (done) {
      var link = $('<a href="#test">')[0];
      analytics.trackLink(link, 'party');
      trigger(link, 'click');
      // Expect the track call to have happened, but for the href not to have
      // been applied yet.
      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test');
      // Expect the href to be applied after the timeout that gives events
      // time to send requests.
      setTimeout(function () {
        expect(window.location.hash).to.equal('#test');
        done();
      }, timeout);
    });

    it('triggers a track and loads the correct href on a link click with multiple links', function (done) {
      var link1 = $('<a href="#test1">')[0]
        , link2 = $('<a href="#test2">')[0]
        , link3 = $('<a href="#test3">')[0];
      analytics.trackLink([link1, link2, link3], 'party');
      trigger(link2, 'click');
      // Expect the track call to have happened, but for the href not to have
      // been applied yet.
      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test2');
      // Expect the href to be applied after the timeout that gives events
      // time to send requests.
      setTimeout(function () {
        expect(window.location.hash).to.equal('#test2');
        done();
      }, timeout);
    });

    it('triggers a track but doesnt load an href on an href with blank target', function () {
      var link = $('<a href="/test/server/mock.html" target="_blank">')[0];
      analytics.trackLink(link, 'party');
      trigger(link, 'click');
      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test');
    });

    // breaks phantom....

    // it('triggers a track but doesnt load an href on a meta link click with an href', function () {
    //   var link = $('<a href="/test/server/mock.html">')[0];
    //   analytics.trackLink(link, 'party');
    //   trigger(link, 'click', { meta: true });
    //   expect(spy.calledWith('party')).to.be(true);
    //   expect(window.location.hash).not.to.equal('#test');
    // });

    it('trackClick is aliased to trackLink for backwards compatibility', function () {
      expect(analytics.trackClick).to.equal(analytics.trackLink);
    });
  });



  describe('trackForm', function () {

    var spy
      , bind     = require('component-event').bind
      , template = '<form action="/test/server/mock.html" target="_blank"><input type="submit" /></form>';

    beforeEach(function () {
      spy = sinon.spy(Integration.prototype, 'track');
      window.location.hash = '';
    });

    afterEach(function () {
      spy.restore();
    });

    it('triggers track', function () {
      var form = $(template)[0];
      analytics.trackForm(form, 'party');
      trigger($(form).find('input')[0], 'click');
      expect(spy.calledWith('party')).to.be(true);
    });

    it('triggers an existing submit handler', function () {
      var form = $(template)[0]
        , spy  = sinon.spy();
      analytics.trackForm(form, 'party');
      bind(form, 'submit', spy);
      trigger($(form).find('input')[0], 'click');
      expect(spy.called).to.be(true);
      expect(spy.thisValues[0]).to.be(form);
    });

    it('calls the forms submit method after a timeout', function (done) {
      var form = $(template)[0]
        , spy  = sinon.spy(form, 'submit');
      analytics.trackForm(form, 'party');
      trigger($(form).find('input')[0], 'click');
      setTimeout(function () {
        expect(spy.called).to.be(true);
        done();
      }, timeout);
    });

    it('allows for event to be a function', function () {
      var form = $(template)[0];
      analytics.trackForm(form, function () { return 'crazy'; });
      trigger($(form).find('input')[0], 'click');
      expect(spy.calledWith('crazy')).to.be(true);
    });

    it('calls a event function with the form that was clicked', function () {
      var spy  = sinon.spy()
        , form = $(template)[0];
      analytics.trackForm(form, spy);
      trigger($(form).find('input')[0], 'click');
      expect(spy.calledWith(form)).to.be(true);
    });

    it('allows for properties to be a function', function () {
      var form = $(template)[0];
      analytics.trackForm(form, 'party', function () {
        return { type : 'crazy' };
      });
      trigger($(form).find('input')[0], 'click');
      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);
    });

    it('calls a properties function with the form that was clicked', function () {
      var spy  = sinon.spy()
        , form = $(template)[0];
      analytics.trackForm(form, 'party', spy);
      trigger($(form).find('input')[0], 'click');
      expect(spy.calledWith(form)).to.be(true);
    });

    it('trackSubmit is aliased to trackForm for backwards compatibility', function () {
      expect(analytics.trackSubmit).to.equal(analytics.trackForm);
    });


    /**
     * A jQuery Form.
     */

    it('triggers track on a $form', function () {
      var $form = $(template);
      analytics.trackForm($form, 'party');
      trigger($form.find('input')[0], 'click');
      expect(spy.calledWith('party')).to.be(true);
    });

    it('triggers an existing jquery submit handler on a $form', function () {
      var $form = $(template)
        , spy   = sinon.spy();
      analytics.trackForm($form, 'party');
      $form.submit(spy);
      trigger($form.find('input')[0], 'click');
      expect(spy.called).to.be(true);
      expect(spy.thisValues[0]).to.be($form[0]);
    });

    it('triggers track on a $form submitted by jQuery', function () {
      var $form = $(template);
      analytics.trackForm($form, 'party');
      $form.submit();
      expect(spy.calledWith('party')).to.be(true);
    });

    it('triggers an existing jquery submit handler on a $form submitted by jQuery', function () {
      var $form = $(template)
        , spy   = sinon.spy();
      analytics.trackForm($form, 'party');
      $form.submit(spy);
      $form.submit();
      expect(spy.called).to.be(true);
      expect(spy.thisValues[0]).to.be($form[0]);
    });
  });



  describe('pageview', function () {

    it('gets called on providers', function () {
      var spy = sinon.spy(Integration.prototype, 'pageview');
      analytics.pageview();
      expect(spy.called).to.be(true);
      spy.restore();
    });

    it('sends a url along', function  () {
      var spy = sinon.spy(Integration.prototype, 'track');
      analytics.track(test.url);
      expect(spy.calledWith(test.url)).to.be(true);
      spy.restore();
    });

    it('sends a clone of context along', function  () {
      var spy = sinon.spy(Integration.prototype, 'track');
      analytics.track(test.url,test.context);
      expect(spy.args[0][1]).not.to.equal(test.context);
      expect(spy.args[0][1]).to.eql(test.context);
      spy.restore();
    });

  });



  describe('alias', function () {

    it('gets called on providers', function () {
      var spy = sinon.spy(Integration.prototype, 'alias');
      analytics.alias();
      expect(spy.called).to.be(true);
      spy.restore();
    });
  });

});