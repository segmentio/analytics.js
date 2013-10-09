
describe('Evergage', function () {

var analytics = window.analytics || require('analytics');

// Global variables Evergage will bind to that we'll use in tests
var globalPushVariable = '_aaq';
var globalAPI = 'Evergage';
var evergagejQuery = 'ajq';

// Various spies and stubs shared between tests
var setUserSpy, setUserFieldSpy, setCompanySpy, setAccountFieldSpy,
    ajaxSpy, aaqPushAppliedSpy, evergageInitSpy, trackActionSpy,
    consoleLogStub;

var originalAjax;
var intervalTimer = 20;

var EVENT_REJECTED = 'Ajax Event rejected.';
var EVENT_SUCCESSFUL = 'Ajax event successful.';
var EVENT_SENT_TO_SERVER = 'Evergage: Event sent to server: ';

this.timeout(3000);

var twReceiverUrl = 'http://' + test.Evergage.global.account + '.evergage.com/twreceiver';

// Sinon doesn't let you spy on callback functions, you can only stub the whole call and provide your own.
// We want to let the request go through so we custom wrap it here before spying.
function stubAjax() {
  originalAjax = window[evergagejQuery].ajax;
  window[evergagejQuery].ajax = function (settings) {
    if (settings && settings.url == twReceiverUrl) {
      var originalSuccessCallback = settings.complete;
      settings.complete = function (xhr, status) {
        console.log(EVENT_SUCCESSFUL, settings.url);
        originalSuccessCallback(xhr, status);
      };
      settings.error = function () {
        console.log(EVENT_REJECTED);
      };
      // Cross-domain JSONP requests fail silently, so we assert failure here
      // by giving the request a 1 second timeout and waiting for it to timeout.
      settings.timeout = 1000;
    }
    return originalAjax(settings);
  };
  ajaxSpy = sinon.spy(window[evergagejQuery], 'ajax');
}

beforeEach(function () {
  consoleLogStub = sinon.stub(window['console'], 'log');
  if (typeof window[evergagejQuery] !== 'undefined') {
    purgeUserAndAccount();
    stubAjax();
    setUserSpy = sinon.spy(window[globalAPI], 'setUser');
    setUserFieldSpy = sinon.spy(window[globalAPI], 'setUserField');
    setCompanySpy = sinon.spy(window[globalAPI], 'setCompany');
    setAccountFieldSpy = sinon.spy(window[globalAPI], 'setAccountField');
    aaqPushAppliedSpy = sinon.spy(window[globalPushVariable], 'push');
    evergageInitSpy = sinon.spy(window[globalAPI], 'init');
    trackActionSpy = sinon.spy(window[globalAPI], 'trackAction');
  }
});

afterEach(function () {
  consoleLogStub.restore();
  if (originalAjax) {
    window[evergagejQuery].ajax = originalAjax;
    originalAjax = null;
  }
  if (typeof aaqPushAppliedSpy === 'function') {
    ajaxSpy.restore();
    setUserSpy.restore();
    setUserFieldSpy.restore();
    setCompanySpy.restore();
    setAccountFieldSpy.restore();
    aaqPushAppliedSpy.restore();
    evergageInitSpy.restore();
    trackActionSpy.restore();
  }
});

function removePreviousEvergageBeaconAndSettings() {
  if (window[globalAPI] !== undefined) {
    window[globalAPI].hideAllMessages();
    window[globalAPI].removeAllListeners();
    window[globalPushVariable] = window[evergagejQuery] = window[globalAPI]
            = window.Apptegic = window.ApptegicTwoWay = window.evergageJSON = window.evergageLog = undefined;
  }
  delete localStorage['evergage'];
  delete localStorage['evergage_update'];
}

function purgeUserAndAccount() {
  analytics.user().reset();
  analytics.group().reset();
  window[evergagejQuery].removeCookie('ajq_user_id');
  window[globalAPI].deleteCustomField('userId', 'visit');
  window[globalAPI].deleteCustomField('_persistedUserId', 'visit');
  window[globalAPI].deleteCustomField('company', 'visit');
  window[globalAPI].deleteCustomField('_persistedAccountId', 'visit');
}

function eventNotSuccessfullySent() {
  return (!consoleLogStub.calledWith(EVENT_SENT_TO_SERVER) || !consoleLogStub.calledWith(EVENT_SUCCESSFUL));
}

function eventNotRejected() {
  return (!trackActionSpy.called || !consoleLogStub.calledWith(EVENT_REJECTED));
}

function expectEventSentToServer() {
  expect(consoleLogStub.calledWith(EVENT_SENT_TO_SERVER)).to.be(true);
  expect(ajaxSpy.calledWithMatch({ url: twReceiverUrl })).to.be(true);
}

function markTestAsComplete(interval, done) {
  clearInterval(interval);
  done();
}

function waitForPreconditionAndAssert(precondition, assert, done) {
  var interval = setInterval(function () {
    if (!precondition()) {
      return;
    }
    assert();
    markTestAsComplete(interval, done);
  }, intervalTimer);
}

function waitForEventSuccessfullySent(assert, done) {
  waitForPreconditionAndAssert(function () {
    return (!eventNotSuccessfullySent());
  }, function () {
    if (assert != null && typeof assert === 'function') {
      assert();
    }
    expectEventSentToServer();
  }, done);
}


describe('With Accounts', function () {


describe('Anonymous Enabled', function () {

describe('#initialize', function () {
  it('should call ready and load library and send page load action', function (done) {
    removePreviousEvergageBeaconAndSettings();
    analytics._readied = false;

    var readySpy = sinon.spy();
    ajaxSpy = null;

    expect(window[globalAPI]).to.be(undefined);
    expect(window[globalPushVariable]).to.be(undefined);

    var initialPushFunction = window[globalPushVariable];

    analytics.ready(readySpy);
    var evergageOptions = test['Evergage'].global;
    evergageOptions.dataset = test['Evergage'].accounts.anonymousEnabled;
    analytics.initialize({ 'Evergage' : evergageOptions });

    // A queue is created, so it's ready immediately.
    expect(window[globalPushVariable]).not.to.be(undefined);
    expect(readySpy.called).to.be(true);

    waitForPreconditionAndAssert(function () {
        if (typeof window[globalAPI] === 'undefined') {
          return false;
        }
        expect(window[globalPushVariable]).not.to.eql(initialPushFunction);
        expect(window[globalAPI]).not.to.be(undefined);

        if (ajaxSpy == null) {
          stubAjax();
        }
        if (!ajaxSpy.calledWithMatch({ url: twReceiverUrl })
            || !consoleLogStub.calledWith(EVENT_SUCCESSFUL)) {
          return false;
        }
        return true;
      }, function () {
        expectEventSentToServer();
      }, done);
  });
});

describe('#identify', function () {
  it('should call setUser', function (done) {
    analytics.identify(test.userId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setUserSpy.called;
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.called).to.be(false);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should not call setUser without userId', function () {
    analytics.identify(test.traits);

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
  });

  it('should call setUserField for traits', function (done) {
    analytics.identify(test.userId, test.traits);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setUserSpy.called;
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.calledWith('created', test.traits.created, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userEmail', test.traits.email, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userName', test.traits.name, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#group', function () {
  it('should call setCompany', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setCompanySpy.called;
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.called).to.be(false);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should not call setCompany without groupId', function () {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group();

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
    expect(setCompanySpy.called).to.be(false);
    expect(setAccountFieldSpy.called).to.be(false);
  });

  it('should call setAccountField', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId, test.groupProperties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setCompanySpy.called;
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.calledWith('employees', test.groupProperties.employees, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('name', test.groupProperties.name, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('plan', test.groupProperties.plan, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#track', function () {
  it('should call trackAction and send action without userId', function (done) {
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
    }, done);
  });

  it('should call trackAction and send action without account is rejected', function (done) {
    analytics.identify(test.userId);
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    // TODO: When we fix the server to allow users without accounts in b2b datasets,
    // change change this whole section to look like the test above, calling waitForEventSuccessfullySent()
    waitForPreconditionAndAssert(function () {
      return !eventNotRejected();
    }, function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
      expectEventSentToServer();
    }, done);
  });

  it('should call trackAction and send action', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
    }, done);
  });

  it('should call trackAction with properties and send action', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event, test.properties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event, test.properties)).to.be(true);
    }, done);
  });
});


describe('#pageview', function () {
  it('should call Evergage.init(true) and send action without userId/account', function (done) {
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });

  it('should call Evergage.init(true) and send action', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });

  it('should call Evergage.init(true) and send action with url', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    analytics.pageview('http://www.google.com');
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });
});

});


describe('Anonymous Disabled', function () {


describe('#initialize', function () {
  it('should call ready and load library', function (done) {
    removePreviousEvergageBeaconAndSettings();
    analytics._readied = false;

    var readySpy = sinon.spy();
    expect(window[globalAPI]).to.be(undefined);
    expect(window[globalPushVariable]).to.be(undefined);

    var initialPushFunction = window[globalPushVariable];

    analytics.ready(readySpy);
    var evergageOptions = test['Evergage'].global;
    evergageOptions.dataset = test['Evergage'].accounts.anonymousDisabled;
    analytics.initialize({ 'Evergage' : evergageOptions });

    // A queue is created, so it's ready immediately.
    expect(window[globalPushVariable]).not.to.be(undefined);
    expect(readySpy.called).to.be(true);

    waitForPreconditionAndAssert(function () {
        if (typeof window[globalAPI] === 'undefined') {
          return false;
        }
        expect(window[globalPushVariable]).not.to.eql(initialPushFunction);
        expect(window[globalAPI]).not.to.be(undefined);

        if (!consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no user ID. ')) {
          return;
        }
        return true;
      }, function () {}, done);
  });
});


describe('#identify', function () {
  it('should call setUser', function (done) {
    analytics.identify(test.userId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setUserSpy.called;
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.called).to.be(false);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should not call setUser without userId', function () {
    analytics.identify(test.traits);

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
  });

  it('should call setUserField for traits', function (done) {
    analytics.identify(test.userId, test.traits);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setUserSpy.called;
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.calledWith('created', test.traits.created, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userEmail', test.traits.email, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userName', test.traits.name, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#group', function () {
  it('should call setCompany and send page load event', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return (setCompanySpy.called && consoleLogStub.calledWith(EVENT_SUCCESSFUL));
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.called).to.be(false);
      expectEventSentToServer();
    }, done);
  });

  it('should not call setCompany without groupId', function () {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group();

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
    expect(setCompanySpy.called).to.be(false);
    expect(setAccountFieldSpy.called).to.be(false);
  });

  it('should call setAccountField', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId, test.groupProperties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setCompanySpy.called;
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.calledWith('employees', test.groupProperties.employees, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('name', test.groupProperties.name, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('plan', test.groupProperties.plan, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#track', function () {
  it('should call trackAction and not send action without userId', function (done) {
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return trackActionSpy.called;
    }, function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
      expect(consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no user ID. ')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should call trackAction and not send action without account', function (done) {
    analytics.identify(test.userId);
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return trackActionSpy.called;
    }, function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
      expect(consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no account. ')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should call trackAction and send action', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
    }, done);
  });

  it('should call trackAction with properties and send action', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event, test.properties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event, test.properties)).to.be(true);
    }, done);
  });
});


describe('#pageview', function () {
  it('should call Evergage.init(true) and not send action without userId', function (done) {
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForPreconditionAndAssert(function () {
      return consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no user ID. ');
    }, function () {
      expect(ajaxSpy.calledWithMatch({ url: twReceiverUrl })).to.be(false);
    }, done);
  });

  it('should call Evergage.init(true) and not send action until userId and account set', function (done) {
    analytics.identify(test.userId);
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    var assertedActionNotSentYet = false;
    var interval = setInterval(function () {
      if (!consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no account. ')) {
        return;
      }
      if (!assertedActionNotSentYet) {
        expect(ajaxSpy.calledWithMatch({ url: twReceiverUrl })).to.be(false);
        analytics.group(test.groupId);
        assertedActionNotSentYet = true;
      }
      if (!consoleLogStub.calledWith(EVENT_SUCCESSFUL)) {
        return;
      }
      expectEventSentToServer();
      markTestAsComplete(interval, done);
    }, intervalTimer);
  });

  it('should call Evergage.init(true) and send action', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });

  it('should call Evergage.init(true) and send action with url', function (done) {
    analytics.identify(test.userId);
    analytics.group(test.groupId);
    analytics.pageview('http://www.google.com');
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });
});

});

});


describe('Without Accounts', function () {


describe('Anonymous Enabled', function () {


describe('#initialize', function () {
  it('should call ready and load library and send page load action', function (done) {
    removePreviousEvergageBeaconAndSettings();
    analytics._readied = false;

    var readySpy = sinon.spy();
    ajaxSpy = null;

    expect(window[globalAPI]).to.be(undefined);
    expect(window[globalPushVariable]).to.be(undefined);

    var initialPushFunction = window[globalPushVariable];

    analytics.ready(readySpy);
    var evergageOptions = test['Evergage'].global;
    evergageOptions.dataset = test['Evergage'].noAccounts.anonymousEnabled;
    analytics.initialize({ 'Evergage' : evergageOptions });

    // A queue is created, so it's ready immediately.
    expect(window[globalPushVariable]).not.to.be(undefined);
    expect(readySpy.called).to.be(true);

    waitForPreconditionAndAssert(function () {
        if (typeof window[globalAPI] === 'undefined') {
          return;
        }
        expect(window[globalPushVariable]).not.to.eql(initialPushFunction);
        expect(window[globalAPI]).not.to.be(undefined);

        if (ajaxSpy == null) {
          stubAjax();
        }
        if (!ajaxSpy.calledWithMatch({ url: twReceiverUrl })
            || !consoleLogStub.calledWith(EVENT_SUCCESSFUL)) {
          return;
        }
        return true;
      }, function () {
        expect(ajaxSpy.callCount == 1).to.be(true);
        expectEventSentToServer();
      }, done);
  });
});


describe('#identify', function () {
  it('should call setUser', function (done) {
    analytics.identify(test.userId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setUserSpy.called;
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.called).to.be(false);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should not call setUser without userId', function () {
    analytics.identify(test.traits);

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
  });

  it('should call setUserField for traits', function (done) {
    analytics.identify(test.userId, test.traits);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setUserSpy.called;
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.calledWith('created', test.traits.created, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userEmail', test.traits.email, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userName', test.traits.name, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#group', function () {
  it('should call setCompany', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setCompanySpy.called;
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.called).to.be(false);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should not call setCompany without groupId', function () {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group();

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
    expect(setCompanySpy.called).to.be(false);
    expect(setAccountFieldSpy.called).to.be(false);
  });

  it('should call setAccountField', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId, test.groupProperties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setCompanySpy.called;
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.calledWith('employees', test.groupProperties.employees, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('name', test.groupProperties.name, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('plan', test.groupProperties.plan, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#track', function () {
  it('should call trackAction and send action without userId', function (done) {
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
        expect(trackActionSpy.calledWith(test.event)).to.be(true);
    }, done);
  });

  it('should call trackAction and send action', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
    }, done);
  });

  it('should call trackAction with properties and send action', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event, test.properties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event, test.properties)).to.be(true);
    }, done);
  });
});


describe('#pageview', function () {
  it('should call Evergage.init(true) and send action without userId', function (done) {
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });

  it('should call Evergage.init(true) and send action', function (done) {
    analytics.identify(test.userId);
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });

  it('should call Evergage.init(true) and send action with url', function (done) {
    analytics.identify(test.userId);
    analytics.pageview('http://www.google.com');
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });
});

});


describe('Anonymous Disabled', function () {

describe('#initialize', function () {
  it('should call ready and load library', function (done) {
    removePreviousEvergageBeaconAndSettings();
    analytics._readied = false;

    var readySpy = sinon.spy();
    expect(window[globalAPI]).to.be(undefined);
    expect(window[globalPushVariable]).to.be(undefined);

    var initialPushFunction = window[globalPushVariable];

    analytics.ready(readySpy);
    var evergageOptions = test['Evergage'].global;
    evergageOptions.dataset = test['Evergage'].noAccounts.anonymousDisabled;
    analytics.initialize({ 'Evergage' : evergageOptions });

    // A queue is created, so it's ready immediately.
    expect(window[globalPushVariable]).not.to.be(undefined);
    expect(readySpy.called).to.be(true);

    waitForPreconditionAndAssert(function () {
        if (typeof window[globalAPI] === 'undefined') {
          return false;
        }
        expect(window[globalPushVariable]).not.to.eql(initialPushFunction);
        expect(window[globalAPI]).not.to.be(undefined);

        if (!consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no account. ')
            && !consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no user ID. ')) {
          return false;
        }
        return true;
      }, function () {}, done);
  });
});


describe('#identify', function () {
  it('should call setUser and send page load event', function (done) {
    analytics.identify(test.userId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return (setUserSpy.called && consoleLogStub.calledWith(EVENT_SUCCESSFUL));
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.called).to.be(false);
      expectEventSentToServer();
    }, done);
  });

  it('should not call setUser without userId', function () {
    analytics.identify(test.traits);

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
  });

  it('should call setUserField for traits', function (done) {
    analytics.identify(test.userId, test.traits);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setUserSpy.called;
    }, function () {
      expect(setUserSpy.calledWith(test.userId)).to.be(true);
      expect(setUserFieldSpy.calledWith('created', test.traits.created, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userEmail', test.traits.email, 'page')).to.be(true);
      expect(setUserFieldSpy.calledWith('userName', test.traits.name, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#group', function () {
  it('should call setCompany', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setCompanySpy.called;
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.called).to.be(false);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should not call setCompany without groupId', function () {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group();

    expect(aaqPushAppliedSpy.called).to.be(false);
    expect(ajaxSpy.called).to.be(false);
    expect(setCompanySpy.called).to.be(false);
    expect(setAccountFieldSpy.called).to.be(false);
  });

  it('should call setAccountField', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.group(test.groupId, test.groupProperties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return setCompanySpy.called;
    }, function () {
      expect(setCompanySpy.calledWith(test.groupId)).to.be(true);
      expect(setAccountFieldSpy.calledWith('employees', test.groupProperties.employees, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('name', test.groupProperties.name, 'page')).to.be(true);
      expect(setAccountFieldSpy.calledWith('plan', test.groupProperties.plan, 'page')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });
});


describe('#track', function () {
  it('should call trackAction and not send action without userId', function (done) {
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForPreconditionAndAssert(function () {
      return trackActionSpy.called;
    }, function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
      expect(consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no user ID. ')).to.be(true);
      expect(ajaxSpy.called).to.be(false);
    }, done);
  });

  it('should call trackAction and send action', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event)).to.be(true);
    }, done);
  });

  it('should call trackAction with properties and send action', function (done) {
    analytics.identify(test.userId);
    aaqPushAppliedSpy.reset();
    analytics.track(test.event, test.properties);

    expect(aaqPushAppliedSpy.called).to.be(true);
    waitForEventSuccessfullySent(function () {
      expect(trackActionSpy.calledWith(test.event, test.properties)).to.be(true);
    }, done);
  });
});


describe('#pageview', function () {
  it('should call Evergage.init(true) and not send action until userId set', function (done) {
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    var assertedActionNotSentYet = false;
    var interval = setInterval(function () {
      if (!consoleLogStub.calledWith('Evergage: [WARNING] Ignoring attempt to send event with no user ID. ')) {
        return;
      }
      if (!assertedActionNotSentYet) {
        expect(ajaxSpy.calledWithMatch({ url: twReceiverUrl })).to.be(false);
        analytics.identify(test.userId);
        assertedActionNotSentYet = true;
      }
      if (!consoleLogStub.calledWith(EVENT_SUCCESSFUL)) {
        return;
      }
      expectEventSentToServer();
      markTestAsComplete(interval, done);
    }, intervalTimer);
  });

  it('should call Evergage.init(true) and send action', function (done) {
    analytics.identify(test.userId);
    analytics.pageview();
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });

  it('should call Evergage.init(true) and send action with url', function (done) {
    analytics.identify(test.userId);
    analytics.pageview('http://www.google.com');
    expect(evergageInitSpy.calledWith(true)).to.be(true);
    waitForEventSuccessfullySent(null, done);
  });

  after(function () {
    if (typeof window[globalAPI] !== 'undefined') {
      window[globalAPI].setLoggingLevel('NONE');
    }
  });
});

});

});

});
