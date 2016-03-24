# Analytics.js

Analytics.js makes it easy to collect customer data and send it to many different tools using a single, unified API.

One thing that the Astronomer platform does is collect data client-side. We have standardized on [analytics.js](https://github.com/segmentio/analytics.js) to minimize your work required to access our data hub.

If you've already instrumented your app using analytics.js or Segment, our service is 100% API-compatible. We've implemented a standard [analytics.js integration](https://github.com/astronomerio/analytics.js-integrations/blob/astronomer/lib/astronomer/index.js) to the Astronomer backend service.

You can use all the normal features of Analytics.js.

Include the Javascript snippet (shown below) into your app between your `<head>` `</head>` tags.

```html
<script type="text/javascript">
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Astronomer snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.astronomer.io/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
  analytics.load("YOUR_APP_ID");
  analytics.page()
  }}();
</script>
```

Initialize it with your appId. If you haven't made an account yet, [sign up](https://app.astronomer.io/signup) and create a new app by clicking the + icon at the top right of your dashboard. Once the new app is created, the appId will be located within the settings tab.

```javascript
analytics.initialize({  
  "astronomer": {
    "appId": "YOURAPPID"
  }
});
```

##Identify -[ Learn More about this Method](http://docs.astronomer.io/v1.0/docs/event-type-guide#identity) 

```javascript
analytics.identify('1234qwerty', {
    name: 'Arthur Dent',
    email: 'earthling1@hitchhikersguide.com',
    hasTowel: True,
});
```

##Track -[ Learn More about this Method](http://docs.astronomer.io/v1.0/docs/event-type-guide#track) 

```javascript
analytics.track("Added File", {
    fileTitle: "Life, the Universe, and Everything",
    fileSize: "42kb",
    fileType: "PDF"
  }
});
```

##Page -[ Learn More about this Method](http://docs.astronomer.io/v1.0/docs/event-type-guide#page) 

```javascript
analytics.page('Library');
```

>> **Note: For Single Page Applications**
>> If you're using Astronomer for a Single Page Application, you will need to track page loads manually. The best practice for this is to hook into the router and call `page` after route changes.

##Group -[ Learn More about this Method](http://docs.astronomer.io/v1.0/docs/event-type-guide#group) 

```javascript
analytics.group('5678dvorak', {
    name:"The Hitchhikers",
    relativePosition: "[39.1000° N, 84.5167° W]"
  }
});
```

##Alias -[ Learn More about this Method](http://docs.astronomer.io/v1.0/docs/event-type-guide#group) 

```javascript
analytics.alias(userId,previousId);
```

Putting it all together, here's a sample HTML file that you can test with — you just need to replace `YOURAPPID` with a real appId that you get from the Astronomer service.

```html
<!DOCTYPE html>  
<html>

<head>  
  <title>Astronomer Demo</title>

  <script type="text/javascript">
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Astronomer snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.astronomer.io/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load("YOUR_APP_ID");
    analytics.page()
    }}();
  </script>

  <script type='text/javascript'>
    analytics.initialize({
      "astronomer": {
        "appId": "YOURAPPID"
      }
    });

  analytics.identify('1234qwerty', {
      name: 'Arthur Dent',
      email: 'earthling1@hitchhikersguide.com',
      hasTowel: True,
  });

  analytics.track("Added File", {
      fileTitle: "Life, the Universe, and Everything",
      fileSize: "42kb",
      fileType: "PDF"
    }
  });
  </script>
</head>

<body></body>  
</html>  
```






## License

Released under the [MIT license](License.md).
