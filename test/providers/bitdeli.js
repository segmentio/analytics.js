var analytics = require('analytics'),
    clone     = require('component-clone');

!(function (undefined) {

    suite('Bitdeli');

    var options = {
        inputId   : 'x',
        authToken : 'y'
    };

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };

    var url = '/url';


    // Initialize
    // ----------

    test('stores options and adds bitdeli.js on initialize', function (done) {
        expect(window._bdq).to.be(undefined);

        analytics.initialize({ 'Bitdeli' : options });

        expect(window._bdq).not.to.be(undefined);
        expect(analytics.providers[0].options.inputId).to.equal(options.inputId);
        expect(analytics.providers[0].options.authToken).to.equal(options.authToken);


        expect(window._bdq._version).to.be(undefined);
        setTimeout(function () {
            expect(window._bdq._version).not.to.be(undefined);
            done();
        }, 1900);
    });

    test('throws error when initialized with a string instead of an object', function () {
        expect(function() {
            analytics.initialize({ 'Bitdeli' : 'invalidToken' });
        }).to.throwException(function (e) {
            expect(e).to.be.an(Error);
        });
    });

    test('throws error on initialize when "inputId" is missing', function () {
        expect(function() {
            var modifiedSettings = analytics.utils.clone(options);
            delete modifiedSettings.inputId;
            analytics.initialize({ 'Bitdeli' : modifiedSettings });
        }).to.throwException(function (e) {
            expect(e).to.be.an(Error);
        });
    });

    test('throws error on initialize when "authToken" is missing', function () {
        expect(function() {
            var modifiedSettings = analytics.utils.clone(options);
            delete modifiedSettings.authToken;
            analytics.initialize({ 'Bitdeli' : modifiedSettings });
        }).to.throwException(function (e) {
            expect(e).to.be.an(Error);
        });
    });

    test('pushes "trackPageview" on initialize', function () {
        window._bdq = [];
        var spy = sinon.spy(window._bdq, 'push');

        analytics.initialize({ 'Bitdeli' : options });

        expect(spy.calledWith(['trackPageview', undefined])).to.be(true);
        spy.restore();
    });

    test('can disable initial "trackPageview" on initialize', function () {
        window._bdq = [];
        var spy = sinon.spy(window._bdq, 'push');

        var modifiedSettings = clone(options);
        modifiedSettings.initialPageview = false;
        analytics.initialize({ 'Bitdeli' : modifiedSettings });

        expect(spy.calledWith(['trackPageview'])).to.be(false);
        spy.restore();
    });


    // Identify
    // --------

    test('pushes "identify" on identify', function () {
        var spy = sinon.spy(window._bdq, 'push');
        analytics.identify(traits);
        expect(spy.calledWith(['identify', userId])).to.be(false);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(['identify', userId])).to.be(true);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(['identify', userId])).to.be(true);

        spy.restore();
    });

    test('pushes "set" on identify', function () {
        var spy = sinon.spy(window._bdq, 'push');
        analytics.identify(traits);
        expect(spy.calledWith(['set', traits])).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(['set', traits])).to.be(false);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(['set', traits])).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "track" on track', function () {
        var spy = sinon.spy(window._bdq, 'push');
        analytics.track(event, properties);
        expect(spy.calledWith(['track', event, properties])).to.be(true);

        spy.restore();
    });


    // Pageview
    // --------

    test('pushes "trackPageview" on pageview', function () {
        var spy = sinon.spy(window._bdq, 'push');
        analytics.pageview();
        expect(spy.calledWith(['trackPageview', undefined])).to.be(true);

        spy.reset();
        analytics.pageview(url);
        expect(spy.calledWith(['trackPageview', url])).to.be(true);

        spy.restore();
    });


}());
