
window.test = {

  userId : 'user',

  traits : {
    name    : 'Zeus',
    email   : 'zeus@segment.io',
    created : new Date()
  },

  event : 'event',

  properties : {
    type    : 'uncouth',
    revenue : 29.99
  },

  context : {
    providers : {
      all : true
    }
  },

  url : '/url',

  newUserId : 'new',

  oldUserId : 'old',

  logMessage : 'something',

  logError : new Error('something'),

  logProperties : {
    date : new Date()
  },


  // Providers
  // ---------

  'AdRoll' : {
    advId : 'LYFRCUIPPZCCTOBGRH7G32',
    pixId : 'V7TLXL5WWBA5NOU5MOJQW4'
  },

  'Bitdeli' : {
    inputId   : 'x',
    authToken : 'y'
  },

  'BugHerd' : '7917d741-16cc-4c2b-bb1a-bdd903d53d72',

  'Chartbeat' : {
    uid    : 'x',
    domain : 'example.com'
  },

  'Clicky' : 'x',

  'ClickTale' : {
    projectId      : '19370',
    recordingRatio : '0.0089',
    partitionId    : 'www14'
  },

  'comScore' : {
    c2 : 'x'
  },

  'CrazyEgg' : '00138301',

  'Customer.io' : 'x',

  'Errorception' : 'x',

  'FoxMetrics' : '5135085424023236bca9c08c',

  'Gauges' : 'x',

  'Google Analytics' : {
    classic: {
      trackingId : 'x'
    },
    universal: {
      universalClient: true,
      trackingId : 'x'
    }
  },

  'GoSquared' : 'x',

  'Heap' : 'x',

  'HitTail' : 'x',

  'HubSpot' : 'x',

  'Intercom' : {
    appId     : 'x',
    activator : '#someElement',
    counter   : true
  },

  'Keen IO' : {
    projectToken : 'KEEN_PROJECT_TOKEN'
  },

  'KISSmetrics' : '67f57ae9d61a6981fa07d141bec8c6c37e8b88c7',

  'Klaviyo' : 'x',

  'LiveChat' : '1520', //'2328351',

  'Lytics' : 'x',

  'Mixpanel' : 'x',

  'Olark' : '5798-949-10-1692',

  'Perfect Audience' : '4ff6ade4361ed500020000a5',

  'Pingdom' : '5168f8c6abe53db732000000',

  'Quantcast' : 'x',

  'Qualaroo' : {
    customerId : '47517',
    siteToken  : '9Fd'
  },

  'Sentry' : 'x',

  'SnapEngage' : '782b737e-487f-4117-8a2b-2beb32b600e5',

  'USERcycle' : 'x',

  'UserVoice' : {
    widgetId : 'qTSuuylq5nZrsjC0L8bmg',
    forumId  : 193715,
    tab_label : 'Operations'
  },

  'userfox' : '4v2erxr9c5vzqsy35z9gnk6az',

  'Vero' : 'x',

  'Woopra' : 'x'

};
