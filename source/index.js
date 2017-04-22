'use strict';

var path = require( 'path' );
var ContentManager = require( './content-manager.js' );
var Configuration = require( './models/configuration.js' );

// Apply polyfills.
require( './polyfills/object-assign.js' )();

/**
 * The interface object of the markdown site engine.
 * @type {{getConfiguration: engine.getConfiguration, getContents: engine.getContents}}
 */
var engine = {

  /**
   * Gets the configuration object.
   * @param {string} configPath - The path of the configuration JSON file.
   * @returns {Configuration} The configuration object.
   */
  getConfiguration: function ( configPath ) {
    var data = require( path.join( process.cwd(), configPath ) );

    var config = new Configuration( data );
    Object.freeze( config );
    return config;
  },

  /**
   * Gets the content manager object.
   * @param {Configuration} config - The configuration object.
   * @returns {ContentManager} The content manager object.
   */
  getContents: function ( config ) {
    return new ContentManager( config );
  }
};

Object.freeze( engine );

module.exports = engine;
