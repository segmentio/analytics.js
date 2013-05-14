describe('userfox', function () {

  describe('initialize', function () {

    it('should call ready and load library', function () {
      expect(window._ufq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'userfox' : test['userfox'] });
      expect(spy.called).to.be(true);
      expect(window._ufq).not.to.be(undefined);
    });

    it('should store options', function () {
      analytics.initialize({ 'userfox' : test['userfox'] });
      expect(analytics.providers[0].options.clientId).to.equal(test['userfox']);
    });

  });


  describe('identify', function () {

    it('should not call _ufq identify if theres no email', function () {
      analytics.user.clear();
      var spy = sinon.spy(window._ufq, 'push');
      analytics.identify(test.userId, { name : 'John' });
      expect(spy.called).to.be(false);
      spy.restore();
    });

    it('should call _ufq identify if theres an email', function () {
      var spy = sinon.spy(window._ufq, 'push');
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['init', { 
        clientId : test['userfox'],
        email    : test.traits.email
      }])).to.be(true);
      spy.restore();
    });

    it('should not call _ufq track if theres no created date', function () {
      var spy = sinon.spy(window._ufq, 'push');
      var created = new Date();
      analytics.identify(test.userId,  { name : 'John' });
      expect(spy.calledWith(['track', { signup_date: created.getTime()+'' }])).to.be(false);
      spy.restore();
    });

    it('should call _ufq track if theres a created date', function () {
      var spy = sinon.spy(window._ufq, 'push');
      analytics.user.clear();
      var created = new Date();
      analytics.identify(test.userId, {
        email   : test.traits.email,
        created : created
      });

      expect(spy.calledWith(['track', { signup_date: created.getTime()+'', created : created, email : test.traits.email }])).to.be(true);
      spy.restore();
    });
  });

});