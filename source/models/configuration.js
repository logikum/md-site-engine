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
}

/**
 *
 * @param data
 * @constructor
 */
var Configuration = function( data ) {

  copy( this, data );
  setDefaults( this );

  // Immutable object.
  freeze( this );
};

module.exports = Configuration;
