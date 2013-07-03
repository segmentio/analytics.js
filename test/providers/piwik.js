describe("Piwik", function() {

	describe('initialize', function () {

	    this.timeout(10000);

	    it('should call ready and load library', function (done) {
	      expect(window._paq).to.be(undefined);
s
	      var spy = sinon.spy();
	      analytics.ready(spy);

	      analytics.initialize({ 'Piwik' : test['Piwik'] });
	      expect(window._paq).not.to.be(undefined);

	      // When the library loads, it will create a `KI` global.
	      var interval = setInterval(function () {
	        if (!window._paq) return;
	        expect(window._paq).not.to.be(undefined);
	        clearInterval(interval);
	        done();
	      }, 20);
	    });

	    it('should store options', function () {
	      analytics.initialize({ 'Piwik' : test['Piwik'] });
	      expect(analytics.providers[0].options.id).to.equal(test['Piwik'].id);
	      expect(analytics.providers[0].options.url).to.equal(test['Piwik'].url);
	    });

	  });

	describe("pageview", function() {
		it('should push "_pageview"', function () {
	        analytics.pageview();
	    });

	    it('should push "_pageview" with url', function () {
	        analytics.pageview('/foo/bar');
	    });

	});
});