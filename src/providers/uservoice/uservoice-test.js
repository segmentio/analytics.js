!(function () {

    suite('UserVoice');


    // Initialize
    // ----------

    test('stores settings and loads the UserVoice library on initialize', function (done) {
        expect(window.uvOptions).to.be(undefined);

        analytics.initialize({'UserVoice' : 'qTSuuylq5nZrsjC0L8bmg'});

        expect(window.uvOptions).not.to.be(undefined);
        expect(analytics.providers[0].settings.widgetId).to.equal('qTSuuylq5nZrsjC0L8bmg');

        // Test the library actually loading.
        expect(window._uvts).to.be(undefined);
        setTimeout(function () {
            expect(window._uvts).not.to.be(undefined);
            done();
        }, 1900);
    });

}());