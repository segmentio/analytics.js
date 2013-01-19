!(function () {

    suite('Marketo');


    // Initialize
    // ----------

    test('stores settings and adds munchkin.js on initialize', function (done) {
        expect(window.Munchkin).not.to.exist;

        analytics.initialize({
            'Marketo' : {
                accountId : 'x'
            }
        });

        expect(analytics.providers[0].settings.accountId).to.equal('x');

        // We have to wait for the munchkin.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
            expect(window.Munchkin).to.exist;
            done();
        }, 1000);
    });

}());