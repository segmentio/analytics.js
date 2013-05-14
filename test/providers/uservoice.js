describe('UserVoice', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.UserVoice).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'UserVoice' : test['UserVoice'] });
      expect(window.UserVoice).not.to.be(undefined);
      expect(window.UserVoice.push).to.be(Array.prototype.push);

      // The proper options should get loaded.
      expect(window.UserVoice[0]).to.eql(['showTab', 'classic_widget', {
        widgetId          : test['UserVoice'].widgetId,
        showTab           : true,
        forum_id          : test['UserVoice'].forumId,
        mode              : 'full',
        primary_color     : '#cc6d00',
        link_color        : '#007dbf',
        default_mode      : 'support',
        support_tab_name  : null,
        feedback_tab_name : null,
        tab_label         : 'Feedback & Support',
        tab_color         : '#cc6d00',
        tab_position      : 'middle-right',
        tab_inverted      : false
      }]);

      // Once the library loads, `_uvts` gets set.
      var interval = setInterval(function () {
        if (window.UserVoice.push === Array.prototype.push) return;
        expect(window.UserVoice.push).not.to.be(Array.prototype.push);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'UserVoice' : test['UserVoice'] });
      expect(analytics.providers[0].options.widgetId).to.equal(test['UserVoice'].widgetId);
      expect(analytics.providers[0].options.showTab).to.equal(true);
    });

  });


  describe('identify', function () {

    var extend = require('segmentio-extend');

    it('should call setCustomFields', function () {
      var stub = sinon.stub(window.UserVoice, 'push');

      analytics.identify(test.userId, test.traits);
      expect(stub.called).to.be(true);
      expect(stub.calledWith(['setCustomFields', extend({}, test.traits, { id : test.userId })])).to.be(true);
    });

  });

});