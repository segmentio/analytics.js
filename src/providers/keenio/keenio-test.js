/*global sinon, suite, beforeEach, test, expect, analytics */
!(function() {

    suite('Keen IO');

    var event = 'someEventName';

    var properties = {
        count : 42
    };

    var userId = 'someUserId';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('stores settings and adds keenio.js on initialize', function(done) {
        expect(window.Keen).not.to.exist;

        analytics.initialize({
            'Keen IO': {
                projectId : 'KEEN_PROJECT_ID',
                apiKey    : 'KEEN_API_KEY'
            }
        });
        expect(window.Keen).not.to.be(undefined);
        expect(window.Keen.setGlobalProperties).not.to.be(undefined);
        expect(window.Keen.addEvent).not.to.be(undefined);
        expect(window.Keen._pId).to.equal('KEEN_PROJECT_ID');
        expect(window.Keen._ak).to.equal('KEEN_API_KEY');

        // test actual loading
        expect(window.Keen.Base64).to.be(undefined);
        setTimeout(function () {
            expect(window.Keen.Base64).not.to.be(undefined);
            done();
        }, 1900);
    });


    // Identify
    // --------

    test('calls setGlobalProperties on identify', function() {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.Keen, 'setGlobalProperties');
        analytics.identify();
        expect(spy.called).to.be(false);

        // a custom checker for code re-use. just makes sure that the function
        // passed as the globalProperties, when invoked, returns sane values.
        var customChecker = function (expectedUserId, expectedTraits) {
            expect(spy.calledWithMatch(function (value) {
                if (typeof value === "function") {
                    result = value("some event name");
                    expect(result.user.userId).to.equal(expectedUserId);
                    expect(result.user.traits).to.eql(expectedTraits);
                    return true;
                }
                return false;
            })).to.be(true);
        };

        spy.reset();
        analytics.identify(userId);
        customChecker(userId);

        spy.reset();
        analytics.identify(userId, traits);
        customChecker(userId, traits);

        spy.restore();
    });


    // Track
    // -----

    test('calls addEvent on track', function() {
        var spy = sinon.spy(window.Keen, 'addEvent');
        analytics.track(event, properties);
        // Keen IO adds custom properties, so we need to have a loose match.
        expect(spy.calledWithMatch(event, properties)).to.be(true);

        spy.restore();
    });

}());
