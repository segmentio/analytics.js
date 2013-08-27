
describe('AdRoll', function () {

var when = require('when');

var settings = {
  advId : 'LYFRCUIPPZCCTOBGRH7G32',
  pixId : 'V7TLXL5WWBA5NOU5MOJQW4'
};

describe('initialize', function () {
  it('should call ready and load library', function (done) {
    this.timeout(10000);
    var spy = sinon.spy();
    analytics.ready(spy);
    analytics.initialize({ AdRoll: settings });
    when(function () { return window.__adroll; }, function () {
      expect(window.adroll_adv_id).not.to.be(undefined);
      expect(window.adroll_pix_id).not.to.be(undefined);
      expect(window.adroll_optout).not.to.be(undefined);
      expect(spy.called).to.be(true);
      done();
    });
  });

  it('should store options', function () {
    var options = analytics._providers[0].options;
    expect(options.advId).to.equal(settings.advId);
    expect(options.pixId).to.equal(settings.pixId);
  });
});

});