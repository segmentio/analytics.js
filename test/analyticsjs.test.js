/*global sinon, suite, beforeEach, test, expect, analytics */
(function () {

    suite('analytics.js');

    var providers = {
        'Google Analytics' : {
            apiKey : 'TEST'
        },
        'Segment.io' : {
            apiKey : 'TEST'
        }
    };

    var terseProviders = {
        'Google Analytics' : 'TERSE_TEST',
        'Segment.io'       : 'TERSE_TEST'
    };


    // Initialize
    // ----------

    test('initialize copies providers into this.providers', function () {
        expect(analytics.providers).to.be.empty;
        analytics.initialize(providers);
        expect(analytics.providers.length).to.equal(2);
    });

    test('initialize sends settings to each providers', function () {
        analytics.initialize(providers);
        expect(analytics.providers[0].settings).to.equal(providers['Google Analytics']);
        expect(analytics.providers[1].settings).to.equal(providers['Segment.io']);
    });

    test('initialize allows for apiKey strings as settings', function () {
        analytics.initialize(terseProviders);
        expect(analytics.providers[0].settings.apiKey).to.equal('TERSE_TEST');
        expect(analytics.providers[1].settings.apiKey).to.equal('TERSE_TEST');
    });

    test('initialize sends settings to provider\'s initialize method', function () {
        var spy = sinon.spy(analytics.providers[1], 'initialize');
        analytics.initialize(providers);
        expect(spy).to.have.been.calledWith(providers['Segment.io']);
        spy.restore();
    });


    // Identify
    // --------

    test('identify sends userId along', function () {
        var spy = sinon.spy(analytics.providers[1], 'identify');
        analytics.identify('ID');
        expect(spy).to.have.been.calledWith('ID');
        spy.restore();
    });

    test('identify sends a clone of traits along', function  () {
        var spy = sinon.spy(analytics.providers[1], 'identify');
        var traits = {
            age  : 23,
            name : 'Achilles'
        };
        analytics.identify('ID', traits);
        expect(spy.args[0][1]).not.to.equal(traits);
        expect(spy.args[0][1]).to.deep.equal(traits);
        spy.restore();
    });


    // Track
    // -----

    test('track sends event name along', function () {
        var spy = sinon.spy(analytics.providers[1], 'track');
        analytics.track('party');
        expect(spy).to.have.been.calledWith('party');
        spy.restore();
    });

    test('track sends a clone of event properties along', function  () {
        var spy = sinon.spy(analytics.providers[1], 'track');
        var properties = {
            level  : 'hard',
            volume : 11
        };
        analytics.track('party', properties);
        expect(spy.args[0][1]).not.to.equal(properties);
        expect(spy.args[0][1]).to.deep.equal(properties);
        spy.restore();
    });

})();



