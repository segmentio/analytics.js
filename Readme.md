## How to make changes to predictions and redeploy

In `analytics.js-core`

Push changes to the prediction function

Tag a new version
```
git tag 2.11.x
git push origin 2.11.x
```


In `madkudu.js`

Modify the version number at the top of `lib/index.js`

