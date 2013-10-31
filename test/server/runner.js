
window.mocha.setup({
  ui: 'bdd',
  ignoreLeaks: true,
  slow: 500,
  timeout: 10000
});

$(function () {
  // log errors in IE for easier testing.
  if (window.onerror) window.onerror = console.log;
  // right mocha for the environment
  window.mochaPhantomJS
    ? window.mochaPhantomJS.run()
    : window.cloud(window.mocha.run());
});