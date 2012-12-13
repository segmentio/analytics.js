/*global sinon, suite, beforeEach, test, expect, analytics */
(function () {

    var generateContext = function (provider) {
        analytics.userId = null;
        this.provider = provider;
        this.providers = {};
        this.providers[provider] = {
            apiKey : 'TEST',
            portalId: '62515'
        };
    };

    var userId = 'user';

    var traits = {
        name      : 'Zeus',
        createdAt : new Date('12/30/1989')
    };

    var mixpaneledTraits = {
        $name    : 'Zeus',
        $created : new Date('12/30/1989')
    };

    var event = 'event';

    var properties = {
        count : 42
    };

    var identify = {
        full   : function () { window.analytics.identify(userId, traits); },
        traits : function () { window.analytics.identify(traits); },
        userId : function () { window.analytics.identify(userId); }
    };

    var track = function () {
        window.analytics.track(event, properties);
    };


    // Google Analytics
    // ----------------
    // https://developers.google.com/analytics/devguides/collection/gajs/
    // Last updated: September 27th, 2012

    suite('Google Analytics');

    beforeEach(function () {
        generateContext.call(this, 'Google Analytics');
    });

    test('stores settings and adds ga.js on initialize', function () {
        expect(window._gaq).not.to.exist;

        analytics.initialize(this.providers);
        expect(window._gaq).to.exist;
        expect(analytics.providers[0].settings).to.equal(this.providers[this.provider]);
    });

    test('pushes "_trackEvent" on track', function () {
        var spy = sinon.spy(window._gaq, 'push');

        track();
        expect(spy).to.have.been.calledWith(['_trackEvent', 'All', event]);
    });


    // KISSmetrics
    // -----------
    // http://support.kissmetrics.com/apis/javascript
    // Last updated: September 27th, 2012

    suite('KISSmetrics');

    beforeEach(function () {
        generateContext.call(this, 'KISSmetrics');
    });

    test('stores settings and adds kissmetrics javascript on initialize', function () {
        expect(window._kmq).not.to.exist;

        analytics.initialize(this.providers);
        expect(window._kmq).to.exist;
        expect(analytics.providers[0].settings).to.equal(this.providers[this.provider]);
    });

    test('pushes "_identify" on identify', function () {
        var spy = sinon.spy(window._kmq, 'push');
        identify.traits();
        expect(spy).to.have.not.been.calledWith(['identify', userId]);

        spy.reset();
        identify.userId();
        expect(spy).to.have.been.calledWith(['identify', userId]);

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith(['identify', userId]);

        spy.restore();
    });

    test('pushes "_set" on identify', function () {
        var spy = sinon.spy(window._kmq, 'push');
        identify.traits();
        expect(spy).to.have.been.calledWith(['set', traits]);

        spy.reset();
        identify.userId();
        expect(spy).to.have.not.been.calledWith(['set', traits]);

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith(['set', traits]);

        spy.restore();
    });

    test('pushes "_record" on track', function () {
        var spy = sinon.spy(window._kmq, 'push');
        track();
        expect(spy).to.have.been.calledWith(['record', event, properties]);

        spy.restore();
    });


    // Mixpanel
    // --------
    // https://mixpanel.com/docs/integration-libraries/javascript
    // https://mixpanel.com/docs/people-analytics/javascript
    // https://mixpanel.com/docs/integration-libraries/javascript-full-api
    // Last updated: September 27th, 2012

    suite('Mixpanel');

    beforeEach(function () {
        generateContext.call(this, 'Mixpanel');
    });

    test('stores settings and adds mixpanel.js on initialize', function () {
        expect(window.mixpanel).not.to.exist;

        analytics.initialize(this.providers);
        expect(window.mixpanel).to.exist;
        expect(analytics.providers[0].settings).to.equal(this.providers[this.provider]);
    });

    test('calls init on initialize');

    test('calls identify on identify', function () {
        var spy = sinon.spy(window.mixpanel, 'identify');
        identify.traits();
        expect(spy).to.have.not.been.called;

        spy.reset();
        identify.userId();
        expect(spy).to.have.been.calledWith(userId);

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith(userId);

        spy.restore();
    });

    test('calls register on identify', function () {
        var spy = sinon.spy(window.mixpanel, 'register');
        identify.traits();
        expect(spy).to.have.been.calledWith(mixpaneledTraits);

        spy.reset();
        identify.userId();
        expect(spy).to.have.not.been.called;

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith(mixpaneledTraits);

        spy.restore();
    });

    test('calls name_tag on identify', function () {
        var spy = sinon.spy(window.mixpanel, 'name_tag');
        identify.traits();
        expect(spy).to.have.not.been.called;

        spy.reset();
        identify.userId();
        expect(spy).to.have.been.calledWith(userId);

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith(userId);

        spy.restore();
    });

    test('calls track on track', function () {
        var spy = sinon.spy(window.mixpanel, 'track');
        track();
        // Mixpanel adds custom properties, so we need to have a loose match.
        expect(spy).to.have.been.calledWith(event, sinon.match(properties));

        spy.restore();
    });

    test('calls people.identify on identify if `people` setting is true', function () {
        analytics.providers[0].settings.people = true;
        var spy = sinon.spy(window.mixpanel.people, 'identify');
        identify.traits();
        expect(spy).to.have.not.been.called;

        spy.reset();
        identify.userId();
        expect(spy).to.have.been.calledWith(userId);

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith(userId);

        spy.restore();
    });

    test('doesnt call people.identify on identify if `people` setting is false', function () {
        analytics.providers[0].settings.people = false;
        var spy = sinon.spy(window.mixpanel.people, 'identify');
        identify.full();
        expect(spy).not.to.have.been.called;

        spy.restore();
    });

    test('calls people.set on identify if `people` setting is true', function () {
        analytics.providers[0].settings.people = true;
        var spy = sinon.spy(window.mixpanel.people, 'set');
        identify.traits();
        expect(spy).to.have.been.calledWith(mixpaneledTraits);

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith(mixpaneledTraits);

        spy.restore();
    });

    test('doesnt call people.set on identify if `people` setting is false', function () {
        analytics.providers[0].settings.people = false;
        var spy = sinon.spy(window.mixpanel.people, 'set');
        identify.full();
        expect(spy).not.to.have.been.called;

        spy.restore();
    });


    // Intercom
    // --------
    // Last updated: September 27th, 2012

    suite('Intercom');

    beforeEach(function () {
        generateContext.call(this, 'Intercom');
    });

    test('stores settings on initialize', function () {
        analytics.initialize(this.providers);
        expect(analytics.providers[0].settings).to.equal(this.providers[this.provider]);
    });

    test('adds intercom javascript on identify', function () {
        expect(window.intercomSettings).not.to.exist;

        identify.full();
        expect(window.intercomSettings).to.exist;
    });

    test('does not add javascript on track', function () {
        delete window.intercomSettings;
        track();
        expect(window.intercomSettings).not.to.exist;
    });


    // Customer.io
    // ----------
    // http://customer.io/docs/api/javascript.html
    // Last updated: December 6th, 2012

    suite('Customer.io');

    beforeEach(function () {
        generateContext.call(this, 'Customer.io');
    });

    test('stores settings and adds customer.io\'s track.js on initialize', function () {
        expect(window._cio).not.to.exist;

        analytics.initialize(this.providers);
        expect(window._cio).to.exist;
        expect(analytics.providers[0].settings).to.equal(this.providers[this.provider]);
    });

    test('calls initialize on initialize');

    test('calls identify on identify', function () {
        var spy = sinon.spy(window._cio, 'identify');
        identify.traits();
        expect(spy).to.not.have.been.called;

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith({
            id         : userId,
            name       : traits.name,
            created_at : Math.floor((new Date('12/30/1989')).getTime() / 1000)
        });

        spy.restore();
    });

    test('calls track on track', function () {
        var spy = sinon.spy(window._cio, 'track');
        track();
        expect(spy).to.have.been.calledWith(event, properties);

        spy.restore();
    });


    // CrazyEgg
    // ----------
    // http://crazyegg.com
    // Last updated: December 6th, 2012

    suite('CrazyEgg');

    beforeEach(function () {
        generateContext.call(this, 'CrazyEgg');
    });

    test('stores settings and adds crazyeggs javascript on initialize', function () {

        // Not sure how to test this!?

        /*expect(window._cio).not.to.exist;

        analytics.initialize(this.providers);
        expect(window._cio).to.exist;
        expect(analytics.providers[0].settings).to.equal(this.providers[this.provider]);*/
    });


    // Olark
    // -----
    // Last updated: October 11th, 2012

    suite('Olark');

    beforeEach(function () {
        generateContext.call(this, 'Olark');
    });

    test('stores settings and adds olark.js on initialize', function () {
        expect(window.olark).not.to.exist;

        analytics.initialize(this.providers);
        expect(window.olark).to.exist;
        expect(analytics.providers[0].settings).to.equal(this.providers[this.provider]);
    });

    test('updates visitor nickname on identify', function () {
        var spy = sinon.spy(window, 'olark');
        identify.traits();
        expect(spy).to.have.not.been.called;

        spy.reset();
        identify.full();
        expect(spy).to.have.been.calledWith('api.chat.updateVisitorNickname', sinon.match({
            snippet : userId
        }));

        spy.restore();
    });

    test('logs event to operator on track if `track` setting is true', function () {
        analytics.providers[0].settings.track = true;
        var spy = sinon.spy(window, 'olark');
        track();
        expect(spy).to.have.been.calledWith('api.chat.sendNotificationToOperator', sinon.match({
            body : 'Visitor triggered "'+event+'".'
        }));

        spy.restore();
    });

    test('doesnt log event to operator on track if `track` setting is false', function () {
        analytics.providers[0].settings.track = false;
        var spy = sinon.spy(window, 'olark');
        track();
        expect(spy).not.to.have.been.called;

        spy.restore();
    });


    // Chartbeat
    // ---------
    // http://chartbeat.com/docs/adding_the_code/
    // http://chartbeat.com/docs/configuration_variables/
    // http://chartbeat.com/docs/handling_virtual_page_changes/
    // Last updated: September 27th, 2012

    suite('Chartbeat');

    beforeEach(function () {
        generateContext.call(this, 'Chartbeat');
    });

    test('stores settings and adds chartbeat.js on initialize', function (done) {
        expect(window.pSUPERFLY).not.to.exist;

        analytics.initialize(this.providers);

        // We have to wait for the charbeat.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
            expect(window.pSUPERFLY).to.exist;
            expect(analytics.providers[0].settings).to.equal(self.providers[self.provider]);
            done();
        }, 50);
    });

    // HubSpot
    // ----------------
    // Last updated: December 13th, 2012

    suite('HubSpot');

    beforeEach(function () {
        generateContext.call(this, 'HubSpot');
    });

    test('stores settings and adds hubspot js on initialize', function (done) {
        expect(window._hsq).not.to.exist;

        analytics.initialize(this.providers);
        var self = this;
        setTimeout(function () {
            expect(window._hsq).to.exist;
            expect(analytics.providers[0].settings).to.equal(self.providers[self.provider]);
            done();
        }, 100);
    });

    test('pushes "identify" on identify', function () {
        var spy = sinon.spy(window._hsq, 'push');

        identify.traits();
        expect(spy).to.have.been.calledWith(['identify', traits]);
        spy.reset();

        identify.userId();
        expect(spy).to.not.have.been.calledWith(['identify', userId]);
        spy.reset();

        identify.full();
        expect(spy).to.have.been.calledWith(['identify', traits]);

        spy.restore();
    });

    test('pushes "trackEvent" on track', function () {
        var spy = sinon.spy(window._hsq, 'push');

        track();
        expect(spy).to.have.been.calledWith(['trackEvent', event, properties]);
    });

}());