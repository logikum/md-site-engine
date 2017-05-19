'use strict';

var path = require( 'path' );
var marked = require( 'marked' );
var FilingCabinet = require( './filing-cabinet.js' );
var readControls = require( './readers/read-controls.js' );
var readReferences = require( './readers/read-references.js' );
var readComponents = require( './readers/read-components.js' );
var readContents = require( './readers/read-contents.js' );
var ContextFactory = require( './models/context-factory.js' );
var logger = require( './utilities/logger.js' );
var negotiateLanguage = require( './utilities/negotiate-language.js' );
var setDeveloperRoutes = require( './utilities/r-and-d.js' );

var markedRenderer = './utilities/marked-renderer.js';

/**
 * Manages the contents of the site.
 * @param {Configuration} config - The configuration object.
 * @constructor
 */
function ContentManager( config ) {

  var self = this;
  var filingCabinet;
  var contextFactory;

  //region Initialization

  function initialize() {
    var getRenderer = require( config.getRenderer ?
      path.join( './../../../', config.getRenderer ) :
      markedRenderer
    );
    var renderer = getRenderer( marked );
    filingCabinet = new FilingCabinet( config );

    readControls(
      config.controls,
      filingCabinet
    );
    readReferences(
      config.components,
      config.referenceFile,
      filingCabinet
    );
    readComponents(
      config.components,
      config.referenceFile,
      config.localeFile,
      config.layoutSegment,
      config.contentSegment,
      filingCabinet,
      renderer
    );
    readContents(
      config.contents,
      config.submenuFile,
      filingCabinet,
      renderer
    );

    logger.showInfo( '*** Validating elements...' );
    filingCabinet.finalize();
    logger.showInfo( '*** Content manager is initialized.' );

    contextFactory = new ContextFactory( config, filingCabinet );
  }

  //endregion

  initialize();

  //region Public properties

  /**
   * Gets the list of the supported locales.
   * @member {Array.<string>}
   * @readonly
   */
  Object.defineProperty( this, 'supportedLocales', {
    get: function () {
      return filingCabinet.languages;
    },
    enumerable: true,
    configurable: false
  } );

  //endregion

  //region Public methods

  /**
   * Sets up the middlewares of the markdown site engine.
   * @param {Express.Application} app - The express.js application.
   */
  this.setMiddlewares = function( app ) {

    // Set up language.
    app.use( function( req, res, next ) {

      if (!req.session)
        req.session = { language: negotiateLanguage(
          req.headers["accept-language"], filingCabinet.languages, config.defaultLocale
        ) };
      else if (!req.session.language)
        req.session.language = negotiateLanguage(
          req.headers["accept-language"], filingCabinet.languages, config.defaultLocale
        );
      next();
    } );

    // Set up request context.
    app.use( function( req, res, next ) {

      var language = req.session.language;
      var url = req.url;
      var definition = filingCabinet.contents.getDefinition( language, url );
      req.ctx = contextFactory.create( language, url, definition );

      // Apply eventual redirection.
      if (definition.rewrite)
        req.url = definition.rewrite;

      next();
    } );
  };

  /**
   * Sets up the routes of the user defined actions.
   * @param {Express.Application} app - The express.js application.
   * @param {object} actions - An object containing the URLs and paths of the actions.
   */
  this.setActions = function( app, actions ) {

    for (var property in actions) {
      var method = 'post';
      var url = property.toLowerCase();

      // Does property have method?
      var pos = url.indexOf( ':' );
      if (pos > 0) {
        method = url.substring( 0, pos );
        url = url.substring( pos + 1 );
      }
      // Add action handler.
      app[ method ]( url, function( req, res, next) {

        // Get action function.
        var action = require( path.join( '../../../', actions[ property ] ) );

        // Execute the action.
        action( req, req.ctx, function( resultUrl ) {
          req.url = resultUrl || '/404';
          next();
        });
      } );
      logger.routeAdded( url, method.toUpperCase() );
    }
  };

  /**
   * Sets up the routes of the markdown site engine.
   * @param {Express.Application} app - The express.js application.
   * @param {Boolean} isDevelopment - True when the application runs in environment environment.
   */
  this.setRoutes = function( app, isDevelopment ) {

    // Change language.
    app.use( config.paths.setLanguage, function( req, res ) {

      var len = req.baseUrl.length;
      var url = req.originalUrl.split( '?' )[ 0 ].substr( len );
      var curLanguage = req.session.language;
      var newLanguage = url.length > 1 ? url.substr( 1 ) : config.defaultLocale;

      req.session.language = newLanguage;
      var localizedPath = filingCabinet.getLocalizedPath(
        curLanguage, req.query[ 'id' ], newLanguage
      );
      res.redirect( localizedPath );
    } );
    logger.routeAdded( config.paths.setLanguage );

    // Reread the contents.
    app.use( config.paths.reboot, function( req, res ) {

      initialize();
      res.status( 200 ).send( self.get( req.session.language, '/' ) );
    } );
    logger.routeAdded( config.paths.reboot );

    // Search the contents.
    var searchPaths = [ ];

    filingCabinet.languages.forEach( function( language ) {

      var searchPath = filingCabinet.contents.searchPath( language );
      if (searchPath && searchPaths.indexOf( searchPath ) < 0)
        searchPaths.push( searchPath );
    } );
    searchPaths.forEach( function( searchPath ) {

      app.post( searchPath, searchTheContents );
      logger.routeAdded( searchPath, 'POST' );
    } );

    // Developer methods.
    if (isDevelopment)
      setDeveloperRoutes( app, filingCabinet, config.paths, config.develop );

    // Serve contents.
    app.use( '*', function( req, res ) {

      var language = req.session.language;
      var url = req.baseUrl;
      var context = req.ctx;
      if (req.originalUrl !== req.baseUrl) {

        // Recreate the context for the rewritten path.
        var data = context.data;
        var definition = filingCabinet.contents.getDefinition( language, url );
        context = contextFactory.create( language, url, definition );
        Object.assign( context.data, data );
      }
      // Add eventual highlight text to context data.
      if (req.query.hl)
        context.data.highlight = req.query.hl;

      res.status( 200 ).send( filingCabinet.get( language, url, context ) );
    } );
    logger.routeAdded( '/* <all-contents>' );
  };

  function searchTheContents( req, res, next ) {

    // Initialize data.
    req.ctx.data.text2search = '';
    req.ctx.data.results = [ ];

    if (req.body) {
      // Search the required text in the contents.
      req.ctx.data.text2search = req.body.text2search;
      req.ctx.data.results = filingCabinet.contents.search( req.ctx );
    }
    else
      logger.showError( 'Middleware "body-parser" is not applied.' );

    next();
  }

  //endregion
}

module.exports = ContentManager;
