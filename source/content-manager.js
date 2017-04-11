'use strict';

var path = require( 'path' );
var marked = require( 'marked' );
var FilingCabinet = require( './filing-cabinet.js' );
var readControls = require( './readers/read-controls.js' );
var readReferences = require( './readers/read-references.js' );
var readComponents = require( './readers/read-components.js' );
var readContents = require( './readers/read-contents.js' );
var logger = require( './utilities/logger.js' );
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

  Object.defineProperty( this, 'locale', {
    get: function () {
      return config.locale;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'session', {
    get: function () {
      return config.session;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'site', {
    get: function () {
      return config.site;
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
      if (!req.session) {
        req.session = { language: config.defaultLocale };
      } else if (!req.session.language) {
        req.session.language = config.defaultLocale;
      }
      next();
    } );

    // Change language.
    app.use( '/set-language', function ( req, res ) {

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
    app.use( '/reboot', function ( req, res ) {
      initialize();
      res.status( 200 ).send( self.get( req.session.language, '/' ) );
    } );

    // Developer methods.
    if (isDevelopment)
      RandD.setRoutes( app, filingCabinet );

    // Serve contents.
    app.use( '*', function ( req, res ) {
      res.status( 200 ).send( self.get( req.session.language, req.baseUrl ) );
    } );
  };

  //endregion
}

module.exports = ContentManager;
