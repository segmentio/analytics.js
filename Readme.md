## How to make changes to predictions and redeploy

### Step 1

Make your changes in `analytics.js-core`

Run tests with
```
make test
make test-browser
```

Push changes to the prediction function

Tag a new version
```
git tag 2.11.x
git push origin 2.11.x
```

### Step 2

In `/madkudu.js`

Modify the version number at the top of `lib/index.js`

Recompile madkudu.js with
```
make distclean
make build
```

Test by opening `/madkudu.js/index.html in your browser` for testing

### Deploy

[TBA]
