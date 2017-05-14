'use strict';

var path = require( 'path' );
var ContentManager = require( './content-manager.js' );
var Configuration = require( './models/configuration.js' );
var logger = require( './utilities/logger.js' );

// Apply polyfills.
require( './polyfills/object-assign.js' )();

/**
 * Represents the markdown site engine.
 * @constructor
 */
function Engine() {
  // The content manager object.
  var contents = null;

  /**
   * Gets the configuration object.
   * @param {string} configPath - The path of the configuration JSON file.
   * @returns {Configuration} The configuration object.
   */
  this.getConfiguration = function( configPath ) {
    logger.showInfo( '>>> Getting configuration: %s', configPath );

    var data = require( path.join( process.cwd(), configPath ) );
    var config = new Configuration( data );
    Object.freeze( config );

    logger.showInfo( '>>> Configuration is ready: %j', config );
    return config;
  };

  /**
   * Sets up the content manager object.
   * @param {Configuration} config - The configuration object.
   */
  this.getContents = function( config ) {
    logger.showInfo( '>>> Getting contents...' );

    contents = new ContentManager( config );

    logger.showInfo( '>>> Contents are ready.' );
  };

  /**
   * Sets all routes used by te application.
   * @param {Express.Application} app - The express.js application.
   * @param {object} actions - An object containing the URLs and paths of the actions.
   * @param {string} mode - The current Node.js environment.
   */
  this.setRoutes = function( app, actions, mode ) {
    logger.showInfo( '>>> Setting routes...' );

    // Set engine middlewares.
    contents.setMiddlewares( app );

    // Set action routes.
    contents.setActions( app, actions || { } );

    // Set engine routes.
    contents.setRoutes( app, mode === 'development' );

    logger.showInfo( '>>> Routes are ready.' );
  };
}

var engine = new Engine();
Object.freeze( engine );

module.exports = engine;
