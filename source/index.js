'use strict';

var path = require( 'path' );
var Configuration = require( './models/configuration.js' );
var ContentManager = require( './content-manager.js' );

// Apply polyfills.
require( './polyfills/object-assign.js' )();

module.exports = {

  getConfiguration: function ( configPath ) {
    var data = require( path.join( process.cwd(), configPath ) );

    var config = new Configuration( data );
    Object.freeze( config );
    return config;
  },

  getContents: function ( config ) {
    return new ContentManager( config );
  }
};
