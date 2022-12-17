'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var PATH = require( './rd-path.js' );
var logger = require( './logger.js' );
var pkgInfo = require( './../../package.json' );

var cssPath = path.join( process.cwd(), 'node_modules/@logikum/md-site-engine/source/utilities/r-and-d.css' );
var css = fs.readFileSync( cssPath, { encoding: 'utf-8' } );

function backToRoot() {
  return backTo( PATH.root );
}

function backTo( path ) {
  return '<p><a class="btn btn-primary" href="' + path + '">Back</a></p>\n';
}

function show( item ) {
  return '<span class="title">' + item + '</span>';
}

/**
 * Sets the helper routes to support development.
 * @param {Express.Application} app - The express.js application object.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @param {object} paths - The configuration paths.
 */
function setDeveloperRoutes( app, filingCabinet, paths, develop ) {

  // Create document template for resources.
  var head = '\n' +
    '  <link rel="stylesheet" href="' + develop.cssBootstrap + '" />\n' +
    '  <link rel="stylesheet" href="' + develop.cssHighlight + '">\n';
  var foot = '\n' +
    '  <script src="' + develop.jsJQuery + '"></script>\n' +
    '  <script src="' + develop.jsBootstrap + '"></script>\n' +
    '  <script src="' + develop.jsHighlight + '"></script>\n' +
    '  <script>hljs.initHighlightingOnLoad();</script>\n';

  function wrap( title, body ) {
    return '<html>\n<head>' + head + '</head>\n<style>\n' + css + '\n</style>\n\n' +
      '<h1>' + title + '</h1>\n' +
      '<p><i>' + pkgInfo.name + ' v' + pkgInfo.version + '</i></p>\n' +
      body + foot + '\n</body>\n</html>\n';
  }

  // Set up developer paths.
  PATH.init( paths.develop );

  // Developer home page.
  app.get( PATH.root, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Resources',
      '<ul>\n' +
      '  <li><a href="' + PATH.list.languages + '">Languages</a></li>\n' +
      '  <li><a href="' + PATH.list.documents + '">Documents</a></li>\n' +
      '  <li><a href="' + PATH.list.layouts + '">Layouts</a></li>\n' +
      '  <li><a href="' + PATH.list.segments + '">Segments</a></li>\n' +
      '  <li><a href="' + PATH.list.contents + '">Contents</a></li>\n' +
      '  <li><a href="' + PATH.list.menus + '">Menus</a></li>\n' +
      '  <li><a href="' + PATH.list.locales + '">Locales</a></li>\n' +
      '  <li><a href="' + PATH.list.references + '">References</a></li>\n' +
      '  <li><a href="' + PATH.list.controls + '">Controls</a></li>\n' +
      '</ul>\n' +
      '<p><a class="btn btn-success" href="/">Go to site</a></p>\n'
    ) );
  } );
  logger.routeAdded( PATH.root );

  // Lists all languages.
  app.get( PATH.list.languages, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Languages',
      filingCabinet.listLanguages() +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.languages );

  // Lists all documents.
  app.get( PATH.list.documents, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Documents',
      filingCabinet.documents.list( PATH.show.document ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.documents );

  // Display a document.
  app.get( PATH.show.document + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Document: ' + show( key ),
      filingCabinet.documents.show( key ) +
      backTo( PATH.list.documents ) ) );
  } );
  logger.routeAdded( PATH.show.document );

  // Lists all layouts.
  app.get( PATH.list.layouts, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Layouts',
      filingCabinet.layouts.list( PATH.show.layout ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.layouts );

  // Display a layout.
  app.get( PATH.show.layout + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Layout: ' + show( key ),
      filingCabinet.layouts.show( key ) +
      backTo( PATH.list.layouts ) ) );
  } );
  logger.routeAdded( PATH.show.layout );

  // Lists all segments.
  app.get( PATH.list.segments, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Segments',
      filingCabinet.segments.list( PATH.show.segment ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.segments );

  // Display a segment.
  app.get( PATH.show.segment + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Segment: ' + show( key ),
      filingCabinet.segments.show( key ) +
      backTo( PATH.list.segments ) ) );
  } );
  logger.routeAdded( PATH.show.segment );

  // Lists all contents.
  app.get( PATH.list.contents, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Contents',
      filingCabinet.contents.list( PATH.show.content ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.contents );

  // Display a content.
  app.get( PATH.show.content + '/:language/:key', function ( req, res ) {
    var language = req.params[ 'language' ];
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Content: ' + show( key ),
      filingCabinet.contents.show( language, key ) +
      backTo( PATH.list.contents ) ) );
  } );
  logger.routeAdded( PATH.show.content );

  // Lists all menus.
  app.get( PATH.list.menus, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Menus',
      filingCabinet.menus.list( PATH.show.menu ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.menus );

  // Display a menu.
  app.get( PATH.show.menu + '/:language/:key', function ( req, res ) {
    var language = req.params[ 'language' ];
    var key = req.params[ 'key' ];
    var result = filingCabinet.menus.show( language, +key );
    res.status( 200 ).send( wrap( 'Menu: ' + show( result.title ),
      result.list +
      backTo( PATH.list.menus ) ) );
  } );
  logger.routeAdded( PATH.show.menu );

  // Lists all locales.
  app.get( PATH.list.locales, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Locales',
      filingCabinet.locales.list( filingCabinet.languages ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.locales );

  // Lists all references.
  app.get( PATH.list.references, function ( req, res ) {
    res.status( 200 ).send( wrap( 'References',
      filingCabinet.references.list( PATH.show.reference ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.references );

  // Display a reference.
  app.get( PATH.show.reference + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Reference: ' + show( key ),
      filingCabinet.references.show( key ) +
      backTo( PATH.list.references ) ) );
  } );
  logger.routeAdded( PATH.show.reference );

  // Lists all controls.
  app.get( PATH.list.controls, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Controls',
      filingCabinet.controls.list( PATH.show.control ) +
      backToRoot() ) );
  } );
  logger.routeAdded( PATH.list.controls );

  // Display a control.
  app.get( PATH.show.control + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Control: ' + show( key ),
      filingCabinet.controls.show( key ) +
      backTo( PATH.list.controls ) ) );
  } );
  logger.routeAdded( PATH.show.control );
}

module.exports = setDeveloperRoutes;
