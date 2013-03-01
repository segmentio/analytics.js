// `ignoreLeaks` because analytics services are supposed to leak things.
window.mocha.setup({
  ui : 'bdd',
  ignoreLeaks : true
});

$(function () {
  // Log errors in IE for easier testing.
  if (window.onerror) window.onerror = console.log;

  // Run the right mocha depending on our environment.
  if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
  } else {
    window.cloud(window.mocha.run());
  }
});