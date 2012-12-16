/*global sinon, suite, beforeEach, test, expect, analytics */
(function () {

    var provider = {
        initialize : function (settings) {},
        identify : function (userId, traits) {},
        track : function (event, properties) {}
    };
    analytics.addProvider('test', provider);


    suite('initialize');

    test('initialize copies providers into this.providers', function () {
        expect(analytics.providers).to.be.empty;

        analytics.initialize({
            'test' : 'x'
        });
        expect(analytics.providers[0]).to.equal(provider);
    });

    test('initialize sends settings to providers initialize method', function () {
        var spy = sinon.spy(provider, 'initialize');
        analytics.initialize({
            'test' : 'x'
        });
        expect(spy).to.have.been.calledWith('x');

        spy.restore();
    });

    test('initialize resets providers and userId', function () {
        analytics.initialize({
            'test' : 'x'
        });
        analytics.identify('user');
        expect(analytics.providers.length).to.equal(1);
        expect(analytics.userId).to.equal('user');

        analytics.initialize({
            'test' : 'x'
        });
        expect(analytics.providers.length).to.equal(1);
        expect(analytics.userId).to.be.null;
    });


    suite('identify');

    test('identify sends userId along', function () {
        var spy = sinon.spy(provider, 'identify');
        analytics.identify('id');
        expect(spy).to.have.been.calledWith('id');

        spy.restore();
    });

    test('identify sends a clone of traits along', function  () {
        var spy = sinon.spy(provider, 'identify');
        var traits = {
            age  : 23,
            name : 'Achilles'
        };
        analytics.identify('id', traits);
        expect(spy.args[0][1]).not.to.equal(traits);
        expect(spy.args[0][1]).to.deep.equal(traits);

        spy.restore();
    });


    suite('track');

    test('track sends event name along', function () {
        var spy = sinon.spy(provider, 'track');
        analytics.track('party');
        expect(spy).to.have.been.calledWith('party');

        spy.restore();
    });

    test('track sends a clone of properties along', function  () {
        var spy = sinon.spy(provider, 'track');
        var properties = {
            level  : 'hard',
            volume : 11
        };
        analytics.track('party', properties);
        expect(spy.args[0][1]).not.to.equal(properties);
        expect(spy.args[0][1]).to.deep.equal(properties);

        spy.restore();
    });


    suite('utils');

    test('resolveSettings...');

    test('clone returns a copy of an object', function () {
        var object = {
            thing : 1
        };
        expect(analytics.utils.clone(object)).not.to.equal(object);
        expect(analytics.utils.clone(object)).to.deep.equal(object);
    });

    test('extend properly augments an object', function () {
        var object = {
            one : 1
        };
        analytics.utils.extend(object, { two: 2 });
        expect(object).to.deep.equal({
            one : 1,
            two : 2
        });

        analytics.utils.extend(object, { three: 3 }, { four: 4 });
        expect(object).to.deep.equal({
            one   : 1,
            two   : 2,
            three : 3,
            four  : 4
        });

        analytics.utils.extend(object, { one : 2 });
        expect(object).to.deep.equal({
            one   : 2,
            two   : 2,
            three : 3,
            four  : 4
        });
    });

    test('alias properly changes props to their aliases', function () {
        var traits = {
            name  : 'Medusa',
            email : 'medusa@segment.io'
        };

        analytics.utils.alias(traits, {
            email : '$email'
        });
        expect(traits).to.deep.equal({
            name   : 'Medusa',
            $email : 'medusa@segment.io'
        });

        analytics.utils.alias(traits, {
            createdAt : 'created_at'
        });
        expect(traits).to.deep.equal({
            name   : 'Medusa',
            $email : 'medusa@segment.io'
        });
    });

    test('getSeconds returns the seconds of a date', function () {
        var date = new Date(1355548865865);
        expect(analytics.utils.getSeconds(date)).to.equal(1355548865);
    });

    test('isEmail matches emails', function () {
        var isEmail = analytics.utils.isEmail;
        expect(isEmail('team@segment.io')).to.be.true;
        expect(isEmail('t-eam+34@segme-ntio.com')).to.be.true;
        expect(isEmail('team@.org')).to.be.false;
        expect(isEmail('team+45.io')).to.be.false;
        expect(isEmail('@segmentio.com')).to.be.false;
    });

    test('isObject matches objects', function () {
        var isObject = analytics.utils.isObject;
        expect(isObject({})).to.be.true;
        expect(isObject([])).to.be.true;
        expect(isObject(function () {})).to.be.true;
        expect(isObject('string')).to.be.false;
        expect(isObject(0)).to.be.false;
    });

    test('isFunction matches functions', function () {
        var isFunction = analytics.utils.isFunction;
        expect(isFunction(function () {})).to.be.true;
        expect(isFunction({})).to.be.false;
        expect(isFunction([])).to.be.false;
        expect(isFunction('string')).to.be.false;
        expect(isFunction(0)).to.be.false;
    });

    test('isNumber matches numbers', function () {
        var isNumber = analytics.utils.isNumber;
        expect(isNumber(0)).to.be.true;
        expect(isNumber({})).to.be.false;
        expect(isNumber([])).to.be.false;
        expect(isNumber('string')).to.be.false;
        expect(isNumber(function () {})).to.be.false;
    });

    test('isString matches strings', function () {
        var isString = analytics.utils.isString;
        expect(isString('string')).to.be.true;
        expect(isString({})).to.be.false;
        expect(isString([])).to.be.false;
        expect(isString(0)).to.be.false;
        expect(isString(function () {})).to.be.false;
    });

})();



