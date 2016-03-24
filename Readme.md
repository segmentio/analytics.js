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

##Identify

```javascript
analytics.identify('1234qwerty', {
    name: 'Arthur Dent',
    email: 'earthling1@hitchhikersguide.com',
    hasTowel: True,
});
```

The Identity method is how you associate user behavior to the user themselves and all of the included traits that come with them. "Traits" is any custom field you set to help parse and analyze your data once it's been collected. Common examples of traits include: email address, name, age, gender, industry, role. Traits can be strings (*email address, name, role*) integers (*age, zip code, salary*), or booleans (*survey participation, want to learn more, need help getting set up*.)


##Track

```javascript
analytics.track("Added File", {
    fileTitle: "Life, the Universe, and Everything",
    fileSize: "42kb",
    fileType: "PDF"
  }
});
```

Track is the meat of event tracking. Depending on how complex your app is, the bulk of your events will likely be of the 'track' type (second maybe only to 'page' calls.) When setting this event, you'll specify an 'event' field with a label relevant to it's location within your app. For example, if you were tracking whenever a user added a file, you would want to set 'event' equal to 'Added a File' or something of the like. You could also not do this, but then your events wouldn't make any sense. Ultimately your call though. 

Track also uses custom properties which you set. For the file addition example, you might add properties like "fileType" : "PDF", "fileSize" : "123MB", and "fileName" : "Best_File_Ever".

##Page

```javascript
analytics.page('Library');
```

The Page method is the most standard of all the methods, the lizard brain buried at the heart of the modern user tracking paradigm. Like it's name would suggest it is used to identify the page a user is on and, thus, is helped by the addition of a 'name' field (although this is not required.) Like Track, Page also has the option to add 'properties' or a dictionary of custom fields with details about the page. 

> **Note: For Single Page Applications**
> If you're using Astronomer for a Single Page Application, you will need to track page loads manually. The best practice for this is to hook into the router and call `page` after route changes.

##Group

```javascript
analytics.group('5678dvorak', {
    name:"The Hitchhikers",
    relativePosition: "[39.1000° N, 84.5167° W]"
  }
});
```

The Group method allows you to associate a user's behavior to that of a larger group. If the tool you're looking to instrument does not support behavior grouping, take some comfort in the knowledge that this functionality will be here if you ever explore one that does. This method is similar to 'Identity' in that it has a supported *traits* field for additional details about the group. 

##Alias 

```javascript
analytics.alias(userId,previousId);
```
The Alias method is used when trying to link previously anonymous behavior (before a user has signed up, for example) to behavior after a user has been identified. This data requires the previous/anonymous id and the current id (both as strings) to be called, which would make sense as without those two fields you would have no reason to call the method in the first place.

---

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
