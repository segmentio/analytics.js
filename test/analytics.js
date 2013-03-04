
describe('Analytics.js', function () {

  var Provider = analytics.Provider.extend({
      key        : 'key',
      options    : {},
      initialize : function (options, ready) {
          setTimeout(ready, 200);
      },
      identify   : function (userId, traits) {},
      track      : function (event, properties) {},
      pageview   : function () {},
      alias      : function (newId, originalId) {}
  });
  analytics.addProvider('Test', Provider);

  var options = { 'Test' : 'x' };


  // Initialize
  // ----------
  describe('initialize', function () {

    it('stores enabled providers', function () {
      // Reset the list of enabled providers first.
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


  // Ready
  // -----

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
      }, 250);
    });

    it('calls callbacks immediately when already initialized', function () {
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

      analytics.identify('id');

      expect(spy.calledWith('id'));

      spy.restore();
    });

    it('sends a clone of traits along', function  () {
      var spy    = sinon.spy(Provider.prototype, 'identify');
      var traits = {
        age  : 23,
        name : 'Achilles'
      };

      analytics.identify('id', traits);

      expect(spy.args[0][1]).not.to.equal(traits);
      expect(spy.args[0][1]).to.eql(traits);

      spy.restore();
    });

    it('sends a clone of context along', function  () {
      var spy    = sinon.spy(Provider.prototype, 'identify');

      var userId = 'id';
      var traits = {
          age  : 23,
          name : 'Achilles'
      };
      var context = {
          providers: { all: true }
      };

      analytics.identify(userId, traits, context);

      expect(spy.args[0][0]).to.equal(userId);
      expect(spy.args[0][1]).to.eql(traits);
      expect(spy.args[0][2]).to.eql(context);

      spy.restore();
    });

    it('calls the callback after the timeout duration', function (done) {
      var callback = sinon.spy();

      analytics.identify('id', { name : 'Achilles' }, callback);

      // The callback shouldn't be called immediately, but after the timeout.
      expect(callback.called).to.be(false);
      setTimeout(function () {
        expect(callback.called).to.be(true);
        done();
      }, analytics.timeout);
    });

    it('takes a callback with optional traits or userId', function (done) {
      var finish   = _.after(4, done);
      var callback = sinon.spy();

      analytics.identify('id', callback);

      setTimeout(function () {
        expect(callback.called).to.be(true);
        finish();
      }, analytics.timeout);

      callback.reset();

      analytics.identify({ name : 'Achilles' }, callback);

      setTimeout(function () {
        expect(callback.called).to.be(true);
        finish();
      }, analytics.timeout);

      callback.reset();

      analytics.identify('id', { name : 'Achilles' }, callback);

      setTimeout(function () {
        expect(callback.called).to.be(true);
        finish();
      }, analytics.timeout);

      var context = { providers: { all: true } };

      analytics.identify('id', { name : 'Achilles' }, context, callback);

      setTimeout(function () {
          expect(callback.called).to.be(true);
          finish();
      }, analytics.timeout);
    });

    it('is turned off by the all providers flag', function  () {
        var spy    = sinon.spy(Provider.prototype, 'identify');

        var userId = 'id';
        var traits = {
            age  : 23,
            name : 'Achilles'
        };
        var context = {
            providers: { all: false }
        };

        analytics.identify(userId, traits, context);

        expect(spy.called).to.be(false);

        spy.restore();
    });

    it('is turned off by the single provider flag', function  () {
        var spy    = sinon.spy(Provider.prototype, 'identify');

        var userId = 'id';
        var traits = {
            age  : 23,
            name : 'Achilles'
        };
        var userContext = {
            providers: { Test: false }
        };

        analytics.identify(userId, traits, userContext);

        expect(spy.called).to.be(false);

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


  // Track
  // -----

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
      var spy        = sinon.spy(Provider.prototype, 'track');
      var properties = {
        level  : 'hard',
        volume : 11
      };

      analytics.track('party', properties);

      expect(spy.args[0][1]).not.to.equal(properties);
      expect(spy.args[0][1]).to.eql(properties);

      spy.restore();
    });

    it('sends a clone of context along', function  () {
        var spy    = sinon.spy(Provider.prototype, 'track');

        var eventName = 'woo';
        var properties = {
            level  : 'hard',
            volume : 11
        };
        var context = {
            providers: { all: true }
        };

        analytics.track(eventName, properties, context);

        expect(spy.args[0][0]).to.equal(eventName);
        expect(spy.args[0][1]).to.eql(properties);
        expect(spy.args[0][2]).to.eql(context);

        spy.restore();
    });

    it('calls the callback after the timeout duration', function (done) {
      var callback = sinon.spy();

      analytics.track('party', { level : 'hard' }, callback);

      // The callback shouldn't be called immediately, but after the timeout.
      expect(callback.called).to.be(false);
      setTimeout(function () {
        expect(callback.called).to.be(true);
        done();
      }, analytics.timeout);
    });
  });


    // Track Link
    // ----------

  describe('trackLink', function () {

    it('triggers a track on a link click', function () {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var link = $('<a>')[0];

      analytics.trackLink(link, 'party');

      triggerClick(link);
      expect(spy.calledWith('party')).to.be(true);

      spy.restore();
    });

    it('triggers a track on a $link click', function () {
      var spy   = sinon.spy(Provider.prototype, 'track');
      var $link = $('<a>');

      analytics.trackLink($link, 'party');

      triggerClick($link[0]);

      expect(spy.calledWith('party')).to.be(true);

      spy.restore();
    });

    it('allows for properties to be a function', function () {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var link = $('<a>')[0];

      analytics.trackLink(link, 'party', function () {
        return { type : 'crazy' };
      });

      triggerClick(link);

      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);

      spy.restore();
    });

    it('calls a properties function with the link that was clicked', function () {
      var spy    = sinon.spy();
      var link = $('<a>')[0];

      analytics.trackLink(link, 'party', spy);

      triggerClick(link);

      expect(spy.calledWith(link)).to.be(true);
    });

    it('triggers a track and loads an href on a link click with an href', function (done) {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var link = $('<a href="#test">')[0];

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
        done();
      }, analytics.timeout);

      spy.restore();
    });

    it('triggers a track and loads the correct href on a link click with multiple links', function (done) {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var link1 = $('<a href="#test1">')[0];
      var link2 = $('<a href="#test2">')[0];
      var link3 = $('<a href="#test3">')[0];

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
        done();
      }, analytics.timeout);

      spy.restore();
    });

    it('triggers a track but doesnt load an href on an href with blank target', function () {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var link = $('<a href="http://google.com" target="_blank">')[0];

      // Make sure hash is reset.
      window.location.hash = '';

      analytics.trackLink(link, 'party');

      triggerClick(link);

      expect(spy.calledWith('party')).to.be(true);
      expect(window.location.hash).not.to.equal('#test');

      spy.restore();
    });

    it('triggers a track but doesnt load an href on a meta link click with an href', function () {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var link = $('<a href="http://google.com">')[0];

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


  // Track Form
  // ----------

  describe('trackForm', function () {

    it('triggers a track on a form submit', function () {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>')[0];

      analytics.trackForm(form, 'party');

      triggerClick($(form).find('input')[0]);

      expect(spy.calledWith('party')).to.be(true);

      spy.restore();
    });

    it('triggers a track on a $form submit', function () {
      var spy   = sinon.spy(Provider.prototype, 'track');
      var $form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>');

      analytics.trackForm($form, 'party');

      triggerClick($form.find('input')[0]);

      expect(spy.calledWith('party')).to.be(true);

      spy.restore();
    });

    it('triggers a track on a $form submitted by jQuery', function () {
      var spy   = sinon.spy(Provider.prototype, 'track');
      var $form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>');

      analytics.trackForm($form, 'party');

      $form.submit();

      expect(spy.calledWith('party')).to.be(true);

      spy.restore();
    });

    it('allows for properties to be a function', function () {
      var spy  = sinon.spy(Provider.prototype, 'track');
      var form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>')[0];

      analytics.trackForm(form, 'party', function () {
          return { type : 'crazy' };
      });

      triggerClick($(form).find('input')[0]);

      expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);

      spy.restore();
    });

    it('calls a properties function with the form that was clicked', function () {
      var spy  = sinon.spy();
      var form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>')[0];

      analytics.trackForm(form, 'party', spy);

      triggerClick($(form).find('input')[0]);

      expect(spy.calledWith(form)).to.be(true);
    });

    it('trackSubmit is aliased to trackForm for backwards compatibility', function () {
      expect(analytics.trackSubmit).to.equal(analytics.trackForm);
    });
  });


  // Pageview
  // --------

  describe('pageview', function () {

    it('gets called on providers', function () {
      var spy = sinon.spy(Provider.prototype, 'pageview');

      analytics.pageview();

      expect(spy.called).to.be(true);

      spy.restore();
    });
  });


  // Alias
  // -----

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