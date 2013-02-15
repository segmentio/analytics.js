!(function () {

    suite('UserVoice');

    var options = {'UserVoice' : 'qTSuuylq5nZrsjC0L8bmg'};


    // Initialize
    // ----------

    test('stores options and loads the UserVoice library on initialize', function (done) {
        expect(window.uvOptions).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(window.uvOptions).not.to.be(undefined);
        expect(window._uvts).to.be(undefined);

        // Once the library loads, `_uvts` gets set.
        setTimeout(function () {
            expect(window._uvts).not.to.be(undefined);
            expect(spy.called).to.be(true);
            done();
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.widgetId).to.equal('qTSuuylq5nZrsjC0L8bmg');
    });

}());