/*global sinon, suite, beforeEach, test, expect, analytics */
!(function () {

    suite('Errorception');


    // Initialize
    // ----------

    test('stores settings and adds errorception.js on initialize', function (done) {
        expect(window._errs).not.to.exist;

        analytics.initialize({
            'Errorception' : {
                projectId : 'x'
            }
        });
        // We have to wait for the errorception.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
            expect(window._errs).to.exist;
            expect(analytics.providers[0].settings.projectId).to.equal('x');
            done();
        }, 500);
    });

}());