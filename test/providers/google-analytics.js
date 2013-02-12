!(function () {

    suite('Google Analytics');


    // Initialize
    // ----------

    test('stores settings and adds ga.js on initialize', function (done) {
        this.timeout(4000);

        expect(window._gaq).to.be(undefined);

        analytics.initialize({ 'Google Analytics' : 'x' });
        expect(window._gaq).not.to.be(undefined);
        expect(window._gaq.push).to.eql(Array.prototype.push);
        expect(analytics.providers[0].settings.trackingId).to.equal('x');

        setTimeout(function () {
            expect(window._gaq.push).not.to.eql(Array.prototype.push);
            done();
        }, 3500);
    });

    test('can set domain on initialize', function () {
        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({
            'Google Analytics' : {
              trackingId : 'x',
              domain     : 'example.com'
            }
        });

        expect(spy.calledWith(['_setDomainName', 'example.com'])).to.be(true);
        spy.restore();
    });

    test('can add enhanced link attribution on initialize', function () {
        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({
            'Google Analytics' : {
              trackingId              : 'x',
              enhancedLinkAttribution : true
            }
        });

        expect(spy.calledWith(['_require', 'inpage_linkid', 'http://www.google-analytics.com/plugins/ga/inpage_linkid.js'])).to.be(true);
        spy.restore();
    });

    test('can add site speed sample rate on initialize', function () {
        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({
            'Google Analytics' : {
              trackingId          : 'x',
              siteSpeedSampleRate : 5
            }
        });

        expect(spy.calledWith(['_setSiteSpeedSampleRate', 5])).to.be(true);
        spy.restore();
    });

    test('can add anonymize ip on initialize', function () {
        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({
            'Google Analytics' : {
              trackingId  : 'x',
              anonymizeIp : true
            }
        });

        expect(spy.calledWith(['_gat._anonymizeIp'])).to.be(true);
        spy.restore();
    });

    test('adds canonical url from meta tag if present', function () {
        // Add the meta tag we need.
        var $meta = $('<meta rel="canonical" href="http://google.com/a-thing">').appendTo('head');

        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({ 'Google Analytics' : 'x' });

        expect(spy.calledWith(['_trackPageview', '/a-thing'])).to.be(true);
        spy.restore();
        $meta.remove();
    });

    test('doesnt add canonical url from meta tag if not present', function () {
        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({ 'Google Analytics' : 'x' });

        expect(spy.calledWith(['_trackPageview', undefined])).to.be(true);
        spy.restore();
    });


    // Track
    // -----

    test('pushes "_trackEvent" on track', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.track('event');
        expect(spy.calledWith(
          ['_trackEvent', 'All', 'event', undefined, undefined, undefined]))
          .to.be(true);

        spy.reset();
        analytics.track('event', {
            category : 'Category'
        });
        expect(spy.calledWith(
          ['_trackEvent', 'Category', 'event', undefined, undefined, undefined]))
          .to.be(true);

        spy.reset();
        analytics.track('event', {
            category       : 'Category',
            label          : 'Label',
            noninteraction : true
        });
        expect(spy.calledWith(
          ['_trackEvent', 'Category', 'event', 'Label', undefined, true]))
          .to.be(true);

        spy.reset();
        analytics.track('event', {
            value : 30
        });
        expect(spy.calledWith(
          ['_trackEvent', 'All', 'event', undefined, 30, undefined]))
          .to.be(true);

        spy.reset();

        spy.reset();
        analytics.track('event', {
            revenue : 9.99
        });
        expect(spy.calledWith(
          ['_trackEvent', 'All', 'event', undefined, 10, undefined]))
          .to.be(true);

        spy.reset();
        analytics.track('event', {
            value    : '30'
        });
        expect(spy.calledWith(
          ['_trackEvent', 'All', 'event', undefined, undefined, undefined]))
          .to.be(true);

        spy.restore();
    });


    // Pageview
    // --------

    test('pushes "_trackPageview" on pageview', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.pageview();
        expect(spy.calledWith(['_trackPageview', undefined])).to.be(true);

        spy.reset();
        analytics.pageview('/url');
        expect(spy.calledWith(['_trackPageview', '/url'])).to.be(true);

        spy.restore();
    });

}());
