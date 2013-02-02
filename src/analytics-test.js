/*global sinon, suite, beforeEach, test, expect, analytics */
(function () {

    var provider = {
        initialize : function (settings) {},
        identify   : function (userId, traits) {},
        track      : function (event, properties) {},
        pageview   : function () {},
        alias      : function (newId, originalId) {}
    };
    analytics.addProvider('test', provider);

    // Initialize the provider above so that everything works even when looking
    // at a single test case.
    analytics.initialize({ 'test' : 'x' });


    // Initialize
    // ----------

    suite('initialize');

    test('stores enabled providers', function () {
        // Reset list of enabled providers.
        analytics.providers = [];

        analytics.initialize({'test' : 'x'});

        expect(analytics.providers[0]).to.equal(provider);
    });

    test('sends settings to enabled providers initialize', function () {
        var spy = sinon.spy(provider, 'initialize');

        analytics.initialize({'test' : 'x'});

        expect(spy.calledWith('x')).to.be(true);

        spy.restore();
    });

    test('resets enabled providers and userId', function () {
        analytics.initialize({'test' : 'x'});
        analytics.identify('user');

        expect(analytics.providers.length).to.equal(1);
        expect(analytics.userId).to.equal('user');

        analytics.initialize({'test' : 'x'});

        expect(analytics.providers.length).to.equal(1);
        expect(analytics.userId).to.be.null;
    });


    // Identify
    // --------

    suite('identify');

    test('is called on providers', function () {
        var spy = sinon.spy(provider, 'identify');

        analytics.identify();

        expect(spy.called).to.be(true);

        spy.restore();
    });

    test('sends userId along', function () {
        var spy = sinon.spy(provider, 'identify');

        analytics.identify('id');

        expect(spy.calledWith('id'));

        spy.restore();
    });

    test('sends a clone of traits along', function  () {
        var spy    = sinon.spy(provider, 'identify');
        var traits = {
            age  : 23,
            name : 'Achilles'
        };

        analytics.identify('id', traits);

        expect(spy.args[0][1]).not.to.equal(traits);
        expect(spy.args[0][1]).to.eql(traits);

        spy.restore();
    });

    test('calls the callback after the timeout duration', function (done) {
        var callback = sinon.spy();

        analytics.identify('id', { name : 'Achilles' }, callback);

        // The callback shouldn't be called immediately, but after the timeout.
        expect(callback.called).to.be(false);
        setTimeout(function () {
            expect(callback.called).to.be(true);
            done();
        }, analytics.timeout);
    });

    test('takes a callback with optional traits or userId', function (done) {
        var finish   = _.after(3, done);
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
    });


    // Track
    // -----

    suite('track');

    test('is called on providers', function () {
        var spy = sinon.spy(provider, 'track');

        analytics.track();

        expect(spy.called).to.be(true);

        spy.restore();
    });

    test('sends event name along', function () {
        var spy = sinon.spy(provider, 'track');

        analytics.track('party');

        expect(spy.calledWith('party')).to.be(true);

        spy.restore();
    });

    test('sends a clone of properties along', function  () {
        var spy        = sinon.spy(provider, 'track');
        var properties = {
            level  : 'hard',
            volume : 11
        };

        analytics.track('party', properties);

        expect(spy.args[0][1]).not.to.equal(properties);
        expect(spy.args[0][1]).to.eql(properties);

        spy.restore();
    });

    test('calls the callback after the timeout duration', function (done) {
        var callback = sinon.spy();

        analytics.track('party', { level : 'hard' }, callback);

        // The callback shouldn't be called immediately, but after the timeout.
        expect(callback.called).to.be(false);
        setTimeout(function () {
            expect(callback.called).to.be(true);
            done();
        }, analytics.timeout);
    });


    // Track Link
    // ----------

    suite('trackLink');

    test('triggers a track on a link click', function () {
        var spy  = sinon.spy(provider, 'track');
        var link = $('<a>')[0];

        analytics.trackLink(link, 'party');

        triggerClick(link);

        expect(spy.calledWith('party')).to.be(true);

        spy.restore();
    });

    test('triggers a track on a $link click', function () {
        var spy   = sinon.spy(provider, 'track');
        var $link = $('<a>');

        analytics.trackLink($link, 'party');

        triggerClick($link[0]);

        expect(spy.calledWith('party')).to.be(true);

        spy.restore();
    });

    test('allows for properties to be a function', function () {
        var spy  = sinon.spy(provider, 'track');
        var link = $('<a>')[0];

        analytics.trackLink(link, 'party', function () {
            return { type : 'crazy' };
        });

        triggerClick(link);

        expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);

        spy.restore();
    });

    test('calls a properties function with the link that was clicked', function () {
        var spy    = sinon.spy();
        var link = $('<a>')[0];

        analytics.trackLink(link, 'party', spy);

        triggerClick(link);

        expect(spy.calledWith(link)).to.be(true);
    });

    test('triggers a track and loads an href on a link click with an href', function (done) {
        var spy  = sinon.spy(provider, 'track');
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

    test('triggers a track and loads the correct href on a link click with multiple links', function (done) {
        var spy  = sinon.spy(provider, 'track');
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

    test('triggers a track but doesnt load an href on an href with blank target', function () {
        var spy  = sinon.spy(provider, 'track');
        var link = $('<a href="http://google.com" target="_blank">')[0];

        // Make sure hash is reset.
        window.location.hash = '';

        analytics.trackLink(link, 'party');

        triggerClick(link);

        expect(spy.calledWith('party')).to.be(true);
        expect(window.location.hash).not.to.equal('#test');

        spy.restore();
    });

    test('triggers a track but doesnt load an href on a meta link click with an href', function () {
        var spy  = sinon.spy(provider, 'track');
        var link = $('<a href="http://google.com">')[0];

        // Make sure hash is reset.
        window.location.hash = '';

        analytics.trackLink(link, 'party');

        triggerClick(link, true);

        expect(spy.calledWith('party')).to.be(true);
        expect(window.location.hash).not.to.equal('#test');

        spy.restore();
    });

    test('trackClick is aliased to trackLink for backwards compatibility', function () {
        expect(analytics.trackClick).to.equal(analytics.trackLink);
    });


    // Track Form
    // ----------

    suite('trackForm');

    test('triggers a track on a form submit', function () {
        var spy  = sinon.spy(provider, 'track');
        var form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>')[0];

        analytics.trackForm(form, 'party');

        triggerClick($(form).find('input')[0]);

        expect(spy.calledWith('party')).to.be(true);

        spy.restore();
    });

    test('triggers a track on a form submit', function () {
        var spy   = sinon.spy(provider, 'track');
        var $form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>');

        analytics.trackForm($form, 'party');

        triggerClick($form.find('input')[0]);

        expect(spy.calledWith('party')).to.be(true);

        spy.restore();
    });

    test('allows for properties to be a function', function () {
        var spy  = sinon.spy(provider, 'track');
        var form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>')[0];

        analytics.trackForm(form, 'party', function () {
            return { type : 'crazy' };
        });

        triggerClick($(form).find('input')[0]);

        expect(spy.calledWith('party', { type : 'crazy' })).to.be(true);

        spy.restore();
    });

    test('calls a properties function with the form that was clicked', function () {
        var spy  = sinon.spy();
        var form = $('<form action="http://google.com" target="_blank"><input type="submit" /></form>')[0];

        analytics.trackForm(form, 'party', spy);

        triggerClick($(form).find('input')[0]);

        expect(spy.calledWith(form)).to.be(true);
    });

    test('trackSubmit is aliased to trackForm for backwards compatibility', function () {
        expect(analytics.trackSubmit).to.equal(analytics.trackForm);
    });


    // Pageview
    // --------

    suite('pageview');

    test('gets called on providers', function () {
        var spy = sinon.spy(provider, 'pageview');

        analytics.pageview();

        expect(spy.called).to.be(true);

        spy.restore();
    });


    // Alias
    // -----

    suite('alias');

    test('gets called on providers', function () {
        var spy = sinon.spy(provider, 'alias');

        analytics.alias();

        expect(spy.called).to.be(true);

        spy.restore();
    });


    // Utils
    // -----

    suite('utils');

    test('resolveSettings converts a settings string into an api key', function() {
        expect(analytics.utils.resolveSettings('x', 'apiKey')).to.eql({ apiKey : 'x' });
        expect(analytics.utils.resolveSettings({ apiKey : 'x' }, 'apiKey')).to.eql({ apiKey : 'x' });
    });

    test('clone returns a copy of an object', function () {
        var object = { thing: 1 };

        expect(analytics.utils.clone(object)).not.to.equal(object);
        expect(analytics.utils.clone(object)).to.eql(object);
    });

    test('extend doesnt break on a non object', function () {
        expect(function () {
            analytics.utils.clone(undefined);
        }).to.not.throwException();
    });

    test('extend augments an object', function () {
        var object = {
            one : 1
        };

        analytics.utils.extend(object, { two: 2 });

        expect(object).to.eql({
            one : 1,
            two : 2
        });

        analytics.utils.extend(object, { three: 3 }, { four: 4 });

        expect(object).to.eql({
            one   : 1,
            two   : 2,
            three : 3,
            four  : 4
        });

        analytics.utils.extend(object, { one: 2 });

        expect(object).to.eql({
            one   : 2,
            two   : 2,
            three : 3,
            four  : 4
        });
    });

    test('extend doesnt break on a non object', function () {
        expect(function () {
            analytics.utils.extend(undefined, { email: '$email' });
        }).to.not.throwException();

        expect(function () {
            analytics.utils.extend({ email: 'ian@segment.io' }, undefined);
        }).to.not.throwException();
    });

    test('alias changes props to their aliases', function () {
        var traits = {
            name  : 'Medusa',
            email : 'medusa@segment.io'
        };

        analytics.utils.alias(traits, { email: '$email' });

        expect(traits).to.eql({
            name   : 'Medusa',
            $email : 'medusa@segment.io'
        });

        analytics.utils.alias(traits, { createdAt: 'created_at' });

        expect(traits).to.eql({
            name   : 'Medusa',
            $email : 'medusa@segment.io'
        });
    });

    test('alias doesnt break on a non object', function () {
        expect(function () {
            analytics.utils.alias(undefined, { email: '$email' });
        }).to.not.throwException();

        expect(function () {
            analytics.utils.alias({ email: 'ian@segment.io' }, undefined);
        }).to.not.throwException();
    });

    test('getSeconds returns the seconds of a date', function () {
        var date = new Date(1355548865865);
        expect(analytics.utils.getSeconds(date)).to.equal(1355548865);
    });

    test('get parameter from url', function () {
        var urlSearchParameter = '?ajs_uid=12k31k2j31k&ajs_event=Test%20Click%20Event&other=1239xxjkjkj&';

        var userId = analytics.utils.getUrlParameter(urlSearchParameter, 'ajs_uid');
        expect(userId).to.equal('12k31k2j31k');

        var event = analytics.utils.getUrlParameter(urlSearchParameter, 'ajs_event');
        expect(event).to.equal('Test Click Event');

        var nonexistent = analytics.utils.getUrlParameter(urlSearchParameter, 'variable');
        expect(nonexistent).to.be.undefined;

        var nonexistent2 = analytics.utils.getUrlParameter('', 'ajs_event');
        expect(nonexistent2).to.be.undefined;

        var hanging = analytics.utils.getUrlParameter('?ajs_uid', 'ajs_uid');
        expect(hanging).to.be.undefined;
    });

    test('isEmail matches emails', function () {
        var isEmail = analytics.utils.isEmail;
        expect(isEmail('team@segment.io')).to.be(true);
        expect(isEmail('t-eam+34@segme-ntio.com')).to.be(true);
        expect(isEmail('team@.org')).to.be(false);
        expect(isEmail('team+45.io')).to.be(false);
        expect(isEmail('@segmentio.com')).to.be(false);
    });

    test('isObject matches objects', function () {
        var isObject = analytics.utils.isObject;
        expect(isObject({})).to.be(true);
        expect(isObject([])).to.be(true);
        expect(isObject(function () {})).to.be(true);
        expect(isObject('string')).to.be(false);
        expect(isObject(0)).to.be(false);
    });

    test('isFunction matches functions', function () {
        var isFunction = analytics.utils.isFunction;
        expect(isFunction(function () {})).to.be(true);
        expect(isFunction({})).to.be(false);
        expect(isFunction([])).to.be(false);
        expect(isFunction('string')).to.be(false);
        expect(isFunction(0)).to.be(false);
    });

    test('isNumber matches numbers', function () {
        var isNumber = analytics.utils.isNumber;
        expect(isNumber(0)).to.be(true);
        expect(isNumber({})).to.be(false);
        expect(isNumber([])).to.be(false);
        expect(isNumber('string')).to.be(false);
        expect(isNumber(function () {})).to.be(false);
    });

    test('isString matches strings', function () {
        var isString = analytics.utils.isString;
        expect(isString('string')).to.be(true);
        expect(isString({})).to.be(false);
        expect(isString([])).to.be(false);
        expect(isString(0)).to.be(false);
        expect(isString(function () {})).to.be(false);
    });

    test('parseUrl can parse URLs', function () {
        var url = 'http://google.com/finance?search=hi#test';

        expect(analytics.utils.parseUrl(url)).to.eql({
            href     : url,
            host     : 'google.com',
            port     : '0',
            hash     : '#test',
            hostname : 'google.com',
            pathname : '/finance',
            protocol : 'http:',
            search   : '?search=hi',
            query    : 'search=hi'
        });
    });

    test('setting and getting a cookie works and matches', function () {
        var name = 'AlbatrossesWith5Eyes';
        var value = '18 <221l3k1j2!@#!@#/>';
        var expirationDays = 4;

        analytics.utils.setCookie(name, value, expirationDays);

        expect(analytics.utils.getCookie(name)).to.eql(value);
    });

})();


// Helper to trigger true DOM click events in all browser ... and IE.
function triggerClick (element, isMeta) {
    var e;
    if (document.createEvent) {
        e = document.createEvent('MouseEvent');
        if (isMeta)
            e.initMouseEvent('click', true, true, null, null, null, null, null, null, true, true, true, true);
        else
            e.initMouseEvent('click', true, true);
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