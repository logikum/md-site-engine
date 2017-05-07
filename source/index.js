'use strict';

var path = require( 'path' );
var ContentManager = require( './content-manager.js' );
var Configuration = require( './models/configuration.js' );

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
    var data = require( path.join( process.cwd(), configPath ) );

    var config = new Configuration( data );
    Object.freeze( config );
    return config;
  };

  /**
   * Sets up the content manager object.
   * @param {Configuration} config - The configuration object.
   */
  this.getContents = function( config ) {

    contents = new ContentManager( config );
  };

  /**
   * Sets all routes used by te application.
   * @param {express.Application} app - The express.js application.
   * @param {object} actions - An object containing the URLs and paths of the actions.
   * @param {string} mode - The current Node.js environment.
   */
  this.setRoutes = function( app, actions, mode ) {

    // Set engine middlewares.
    contents.setMiddlewares( app );

    // Set action routes.
    contents.setActions( app, actions || { } );

    // Set engine routes.
    contents.setRoutes( app, mode === 'development' );
  };
};

var engine = new Engine();
Object.freeze( engine );

module.exports = engine;
