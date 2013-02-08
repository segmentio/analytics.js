!(function () {

    suite('LiveChat');

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('stores settings and loads the LiveChat library on initialize', function (done) {
        expect(window.__lc).to.be(undefined);

        analytics.initialize({'LiveChat' : '2143261'});

        expect(window.__lc).not.to.be(undefined);
        expect(analytics.providers[0].settings.license).to.equal('2143261');

        // Test the library actually loading.
        expect(window.LC_API).to.be(undefined);
        setTimeout(function () {
            expect(window.LC_API).not.to.be(undefined);
            done();
        }, 1900);
    });


    // Identify
    // --------

    test('updates visitor custom variables on identify', function () {
        var spy = sinon.spy(window.LC_API, 'set_custom_variables');

        analytics.identify(traits);
        expect(spy.calledWithMatch([
            { name : 'name', value : traits.name },
            { name : 'email', value : traits.email }
        ])).to.be(true);

        spy.reset();

        analytics.identify(userId);
        expect(spy.calledWithMatch([
            { name : 'User ID', value : userId }
        ])).to.be(true);

        spy.reset();

        analytics.identify(userId, traits);
        expect(spy.calledWithMatch([
            { name : 'User ID', value : userId },
            { name : 'name', value : traits.name },
            { name : 'email', value : traits.email }
        ])).to.be(true);

        spy.restore();
    });

}());