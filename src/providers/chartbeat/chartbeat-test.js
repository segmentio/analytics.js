/*global sinon, suite, beforeEach, test, expect, analytics */
!(function () {

    suite('Chartbeat');

    test('stores settings and adds chartbeat.js on initialize', function (done) {
        expect(window.pSUPERFLY).not.to.exist;

        analytics.initialize({
            'Chartbeat' : {
                uid    : 'x',
                domain : 'example.com'
            }
        });
        // We have to wait for the charbeat.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
            expect(window.pSUPERFLY).to.exist;
            done();
        }, 100);
    });

}());