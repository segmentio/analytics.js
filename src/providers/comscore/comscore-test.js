!(function () {

    suite('comScore');


    // Initialize
    // ----------

    test('stores settings and adds beacon.js on initialize', function (done) {
        expect(window._comscore).to.be(undefined);

        analytics.initialize({
            'comScore' : {
                c2 : 'x'
            }
        });

        // check the initialized contents before beacon.js loads
        expect(window._comscore[0].c1).to.equal('2');
        expect(window._comscore[0].c2).to.equal('x');

        // We have to wait for the beacon.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
            expect(window._comscore).not.to.be(undefined);
            expect(analytics.providers[0].settings.c1).to.equal('2');
            expect(analytics.providers[0].settings.c2).to.equal('x');
            done();
        }, 1900);
    });

}());