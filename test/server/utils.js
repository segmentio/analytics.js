
    window.test = {
      userId : 'user',
      traits : {
        name    : 'Zeus',
        email   : 'zeus@segment.io',
        created : new Date()
      },
      groupId : 'group',
      groupProperties : {
        name      : 'Group',
        employees : 42,
        plan      : 'Gold'
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
      'Google Analytics' : {
        classic: {
          trackingId : 'x'
        },
        universal: {
          universalClient: true,
          trackingId : 'x'
        }
      },
      'Intercom' : {
        appId     : 'x',
        activator : '#someElement',
        counter   : true
      },
      'Preact' : {
        projectCode : 'x'
      },
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
      'Visual Website Optimizer' : 44207,
      'Woopra' : 'x'
    };