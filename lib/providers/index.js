
var each = require('each');


/**
 * List all of our integration constructors.
 */

var Integrations = [
  require('./adroll'),
  require('./amplitude'),
  require('./awesm'),
  require('./bugherd'),
  require('./chartbeat'),
  require('./clicktale'),
  require('./clicky'),
  require('./comscore'),
  require('./crazyegg'),
  require('./customerio'),
  require('./errorception'),
  require('./foxmetrics'),
  require('./gauges'),
  require('./get-satisfaction'),
  require('./google-analytics'),
  require('./gosquared'),
  require('./heap'),
  require('./hittail'),
  require('./hubspot'),
  require('./improvely'),
  require('./inspectlet'),
  require('./intercom'),
  require('./keen-io'),
  require('./kissmetrics'),
  require('./klaviyo'),
  require('./leadlander'),
  require('./livechat'),
  require('./lytics'),
  require('./mixpanel'),
  require('./mousestats'),
  require('./olark'),
  require('./optimizely'),
  require('./perfect-audience'),
  require('./pingdom'),
  require('./preact'),
  require('./qualaroo'),
  require('./quantcast'),
  require('./sentry'),
  require('./snapengage'),
  require('./tapstream'),
  require('./trakio'),
  require('./usercycle'),
  require('./userfox'),
  require('./uservoice'),
  require('./vero'),
  require('./visual-website-optimizer'),
  require('./woopra')
];


/**
 * Expose the integrations, using their own `name` from their `prototype`.
 */

each(Integrations, function (Integration) {
  exports[Integration.prototype.name] = Integration;
});