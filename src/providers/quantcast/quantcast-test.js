!(function () {

    suite('Quantcast');


    // Initialize
    // ----------

    test('stores settings and adds quant.js on initialize', function (done) {
        expect(window._qevents).to.be(undefined);

        analytics.initialize({
            'Quantcast' : {
                pCode : 'x'
            }
        });
        // We have to wait for the quant.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
            expect(window._qevents).not.to.be(undefined);
            expect(analytics.providers[0].settings.pCode).to.equal('x');
            done();
        }, 1900);
    });

}());