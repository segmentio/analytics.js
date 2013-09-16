/**
 * Analytics.js
 *
 * (C) 2013 Segment.io Inc.
 */

var Analytics = require('./analytics')
  , bind = require('bind');


/**
 * Expose an `analytics` singleton.
 */

module.exports = new Analytics();


/**
 * Bind methods on `analytics` to itself.
 */

bind.methods(
  module.exports,
  'init',
  'initialize',
  'identify',
  'user',
  'group',
  'track',
  'trackClick',
  'trackLink',
  'trackSubmit',
  'trackForm',
  'pageview',
  'alias',
  'ready',
  '_options',
  '_callback',
  '_invoke',
  '_parseQuery'
);