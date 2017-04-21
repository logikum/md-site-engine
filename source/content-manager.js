'use strict';

var path = require( 'path' );
var marked = require( 'marked' );
var FilingCabinet = require( './filing-cabinet.js' );
var readControls = require( './readers/read-controls.js' );
var readReferences = require( './readers/read-references.js' );
var readComponents = require( './readers/read-components.js' );
var readContents = require( './readers/read-contents.js' );
var logger = require( './utilities/logger.js' );
var negotiateLanguage = require( './utilities/negotiate-language.js' );
var RandD = require( './utilities/r-and-d.js' );

var markedRenderer = './utilities/marked-renderer.js';

function ContentManager( config ) {

  var self = this;
  var filingCabinet;

  //region Initialization

  function initialize() {
    var getRenderer = require( config.getRenderer ?
      path.join( './../../../', config.getRenderer ) : markedRenderer );
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
  }

  //endregion

  initialize();

  //region Public properties

  Object.defineProperty( this, 'supportedLocales', {
    get: function () {
      return filingCabinet.languages;
    },
    enumerable: true,
    configurable: false
  } );

  //endregion

  //region Public methods

  this.get = function ( language, path ) {
    return filingCabinet.get( language, path );
  };

  this.setRoutes = function ( app, isDevelopment ) {

    // Set up language.
    app.use( function ( req, res, next ) {
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

    // Change language.
    app.use( config.paths.setLanguage, function ( req, res ) {

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

    // Reread the contents.
    app.use( config.paths.reboot, function ( req, res ) {
      initialize();
      res.status( 200 ).send( self.get( req.session.language, '/' ) );
    } );

    // Get the text to search.
    var searchPaths = [ ];
    filingCabinet.languages.forEach( function( language ) {
      var searchPath = filingCabinet.contents.searchPath( language );
      if (searchPath && searchPaths.indexOf( searchPath ) < 0)
        searchPaths.push( searchPath );
    } );
    searchPaths.forEach( function( searchPath ) {
      app.post( searchPath, readSearchPhrase );
    } );

    // Developer methods.
    if (isDevelopment)
      RandD.setRoutes( app, filingCabinet, config.paths.RandD );

    // Serve contents.
    app.use( '*', function ( req, res ) {
      res.status( 200 ).send( self.get( req.session.language, req.baseUrl ) );
      filingCabinet.text2search = '';
    } );
  };

  function readSearchPhrase( req, res, next ) {
    if (req.body)
      filingCabinet.text2search = req.body.text2search;
    else {
      filingCabinet.text2search = '';
      logger.showError( 'Middleware "body-parser" is not applied.' );
    }
    next();
  }

  //endregion
}

module.exports = ContentManager;
