'use strict';

var getConfig = require( './configuration.js' );
var ContentManager = require( './content-manager.js' );

module.exports = {
  getConfig: getConfig,
  getContents: function ( config ) {
    return new ContentManager( config );
  }
};
