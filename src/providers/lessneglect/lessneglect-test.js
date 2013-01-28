!(function () {

    suite('Less Neglect');

    var settings = {
        userId : '12345',
        projectCode : 'x'
    };

    var event = 'event';

    var traits = {
        name: 'Christopher Gooley',
        email: 'gooley@lessneglect.com'
    };

    var properties = {
        item_count : 99,
        external_identifier : 'abc'
    };

    var personEvent = {
        name : 'event',
        external_identifier : 'abc',
        note : null
    }


    // Initialize
    // ----------

    test('adds lessneglect\'s track.js on initialize', function (done) {
        expect(window._lnq).to.be(undefined);

        analytics.initialize({ 'Less Neglect' : settings.projectCode });
        expect(window._lnq).not.to.be(undefined);
        expect(window._lnq.push).to.equal(Array.prototype.push);
        expect(analytics.providers[0].settings.projectCode).to.equal(settings.projectCode);

        setTimeout(function () {
            expect(window._lnq.push).not.to.equal(Array.prototype.push);
            done();
        }, 1000);
    });


    // Identify
    // --------

    test('pushes "person" on identify', function () {
        var spy = sinon.spy(window._lnq, 'push');
        analytics.identify(traits);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(settings.userId);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(settings.userId, traits);
        expect(spy.calledWith(['_setPersonData', {
            name : traits.name,
            email : traits.email,
            external_identifier: settings.userId,
            properties : traits
        }])).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "_logEvent" on track', function () {
        var spy = sinon.spy(window._lnq, 'push');
        analytics.track(event, properties);
        // Less Neglect augments properites so we don't want to check for an exact match,
        // rather check that we have at lease the same properties passed in
        expect(spy.calledWith(['_logEvent', sinon.match(personEvent), sinon.match(properties)])).to.be(true);

        spy.restore();
    });

}());


