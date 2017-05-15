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
  if (!config.localeFile) config.localeFile = 'default.json';
  if (!config.submenuFile) config.submenuFile = '__submenu.txt';
  if (!config.layoutSegment) config.layoutSegment = 'layout';
  if (!config.contentSegment) config.contentSegment = 'content';
  if (!config.getRenderer) config.getRenderer = '';

  // Session default values.
  if (!config.session) config.session = { };
  if (!config.session.secret) config.session.secret = 'md-site-engine';
  if (!config.session.resave) config.session.resave = false;
  if (!config.session.saveUninitialized) config.session.saveUninitialized = true;

  // Redis default values.
  if (!config.redis) config.redis = { };
  if (!config.redis.host) config.redis.host = 'localhost';
  if (!config.redis.port) config.redis.port = 6379;
  if (!config.redis.db) config.redis.db = 0;
  if (!config.redis.pass) config.redis.pass = undefined;

  // Default route paths.
  if (!config.paths) config.paths = { };
  if (!config.paths.notFound) config.paths.notFound = '/404';
  if (!config.paths.setLanguage) config.paths.setLanguage = '/set-language';
  if (!config.paths.reboot) config.paths.reboot = '/reboot';
  if (!config.paths.search) config.paths.search = '/search';
  if (!config.paths.develop) config.paths.develop = '/r&d';

  // Default R&D paths.
  if (!config.develop) config.develop = { };
  if (!config.develop.cssBootstrap) config.develop.cssBootstrap =
    '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';
  if (!config.develop.cssHighlight) config.develop.cssHighlight =
    '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.10.0/styles/ir-black.min.css';
  if (!config.develop.jsJQuery) config.develop.jsJQuery =
    '//code.jquery.com/jquery-2.1.4.min.js';
  if (!config.develop.jsBootstrap) config.develop.jsBootstrap =
    '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js';
  if (!config.develop.jsHighlight) config.develop.jsHighlight =
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
