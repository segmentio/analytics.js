!(function () {

    suite('Improvely');

    var domain = 'demo';
    var project_id = 1;

    var identity = 'test@example.com';
    var event = 'goal';

    var properties = {
        type: 'sale',
        amount: 9.99,
        reference: 'analytics.js'
    };


    // Initialize
    // ----------

    test('stores settings and adds improvely javascript on initialize', function () {
        expect(window.improvely).not.to.exist;
        expect(window._improvely).not.to.exist;

        analytics.initialize({ 'Improvely' : { domain: domain, project_id: project_id } });

        expect(window.improvely).to.exist;
        expect(window._improvely).to.exist;
        expect(analytics.providers[0].settings.domain).to.equal(domain);
        expect(analytics.providers[0].settings.project_id).to.equal(project_id);
    });


    // Identify
    // --------

    test('calls "label" on identify', function () {
        var spy = sinon.spy(window.improvely, 'label');
        
        analytics.identify(identity);
        expect(spy).to.have.been.calledWith(identity);

        spy.restore();
    });


    // Track
    // -----

    test('calls "goal" on track', function () {
        var spy = sinon.spy(window.improvely, 'goal');
        
        analytics.track(event, properties);
        expect(spy).to.have.been.calledWith(properties);

        spy.restore();
    });

}());
