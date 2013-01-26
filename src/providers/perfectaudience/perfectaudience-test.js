!(function () {

	suite('Perfect Audience');

	// Initialize
	// ----------

	test('stores settings and adds perfectaudience.js on initialize', function (done) {
		expect(window._pa).to.be(undefined);

		var siteId = '4ff6ade4361ed500020000a5';

		analytics.initialize({
			'Perfect Audience' : {
				siteId : siteId
			}
		});

		expect(window._pa).not.to.be(undefined);
		expect(analytics.providers[0].settings.siteId).to.equal(siteId);

		// test actual loading
		setTimeout(function () {
			expect(window._pa.track).not.to.be(undefined);
			done();
		}, 1000);
	});

	// Track
	// -----

	test('calls track on track', function () {
		expect(window._pa.track).not.to.be(undefined);

		var event = 'event';
		var properties = {
			orderId: 12345,
			revenue: "19.99"
		};
		var spy = sinon.spy(window._pa, 'track');
		analytics.track(event, properties);
		expect(spy.calledWith(event, sinon.match(properties))).to.be(true);

		spy.restore();
	});

}());