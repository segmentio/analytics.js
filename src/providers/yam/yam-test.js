/*global sinon, suite, beforeEach, test, expect, analytics */
!(function () {

    suite('Yandex.Metrika');

    var id = 'x';

    // Initialize
    // ----------

    test('stores settings and loads yaCounter', function (done) {
        expect(window.yandex_metrika_callbacks).not.to.exist;

        analytics.initialize({
            'Yandex.Metrika' : id
        });
        expect(window.yandex_metrika_callbacks).to.exist;
        expect(analytics.providers[0].settings.id).to.equal(id);

        window.yandex_metrika_callbacks.push(function() {
            expect(window['yaCounter' + id]).to.exist;
            done();
        });
    });

    test('can add webvisor');

    test('can add clickmap');

    test('can add tracking of extrnal links');

    test('can add accurate tracking of bounce rate');

    test('can add noindex option');

    test('can add tracking address bar hash');


    // Track
    // -----

    test('calls reachGoal on track', function () {
        var spy = sinon.spy(window.yaCounterx, 'reachGoal');
        analytics.track('event');
        expect(spy).to.have.been.calledWith('event');

        spy.restore();
    });


    // Pageview
    // --------

    test('calls hit on pageview', function () {
        var spy = sinon.spy(window.yaCounterx, 'hit');
        analytics.pageview();
        expect(spy).to.have.been.called;

        spy.restore();
    });

}());