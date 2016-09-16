'use strict';

var path = require( 'path' );

module.exports = function ( configPath ) {

  var config = require( path.join( process.cwd(), configPath ) );

  // Locale management.
  if (!config.locale) config.locale = {};
  if (!config.locale.default) config.locale.default = 'en';

  // Session default values.
  if (!config.session) config.session = {};
  if (!config.session.secret) config.session.secret = 'business-objects';
  if (!config.session.resave) config.session.resave = false;
  if (!config.session.saveUninitialized) config.session.saveUninitialized = true;

  // Content management.
  if (!config.content) config.content = {};
  if (!config.content.public) config.content.public = "public";
  if (!config.content.contents) config.content.contents = "/contents";
  if (!config.content.layouts) config.content.layouts = "/layouts";
  if (!config.content.locales) config.content.locales = "/locales";
  if (!config.content.plugins) config.content.plugins = "/plugins";
  if (!config.content.documentFile) config.content.documentFile = "document.html";
  if (!config.content.layoutFile) config.content.layoutFile = "layout.html";
  if (!config.content.referenceFile) config.content.referenceFile = "~/references.txt";

  // Return result.
  return config;
};
