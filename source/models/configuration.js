'use strict';

var freeze = require( './../utilities/freeze.js' );

function copy( target, source ) {
  target = Object.assign( target, source );
}

function setDefaults( config ) {

  // Site management.
  if (!config.defaultLocale) config.defaultLocale = 'en';
  if (!config.contents) config.contents = 'contents';
  if (!config.components) config.components = 'components';
  if (!config.controls) config.controls = 'controls';
  if (!config.documentFile) config.documentFile = 'document.html';
  if (!config.layoutFile) config.layoutFile = 'layout.html';
  if (!config.referenceFile) config.referenceFile = 'references.txt';
  if (!config.submenuFile) config.submenuFile = '__submenu.txt';
  if (!config.layoutSegment) config.layoutSegment = 'layout';
  if (!config.contentSegment) config.contentSegment = 'content';
  if (!config.getRenderer) config.getRenderer = '';

  // Session default values.
  if (!config.session) config.session = {};
  if (!config.session.secret) config.session.secret = 'business-objects';
  if (!config.session.resave) config.session.resave = false;
  if (!config.session.saveUninitialized) config.session.saveUninitialized = true;

  // Redis default values.
  if (!config.redis) config.redis = {};
  if (!config.redis.host) config.redis.host = 'localhost';
  if (!config.redis.port) config.redis.port = 6379;
  if (!config.redis.db) config.redis.db = 0;
  if (!config.redis.pass) config.redis.pass = undefined;

  // Default route paths.
  if (!config.paths) config.paths = {};
  if (!config.paths.notFound) config.paths.notFound = '/404';
  if (!config.paths.setLanguage) config.paths.setLanguage = '/set-language';
  if (!config.paths.reboot) config.paths.reboot = '/reboot';
  if (!config.paths.search) config.paths.search = '/search';
  if (!config.paths.RandD) config.paths.RandD = '/r&d';
  // Default R&D paths.
  if (!config.paths.cssBootstrap) config.paths.cssBootstrap =
    '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';
  if (!config.paths.cssHighlight) config.paths.cssHighlight =
    '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.10.0/styles/ir-black.min.css';
  if (!config.paths.jsHighlight) config.paths.jsHighlight =
    '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.10.0/highlight.min.js';
}

/**
 * Represents the configuration of the markdown site engine.
 * @param {object} data - A JSON object that holds the user configuration.
 * @constructor
 */
var Configuration = function( data ) {

  copy( this, data );
  setDefaults( this );

  // Immutable object.
  freeze( this );
};

module.exports = Configuration;
