'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var PATH = require( './rd-path.js' );
var pkgInfo = require( './../../package.json' );

var cssPath = path.join( process.cwd(), 'node_modules/md-site-engine/source/utilities/r-and-d.css' );
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
function setDeveloperRoutes( app, filingCabinet, paths ) {

  // Create document template for resources.
  var head = '\n' +
    '  <link rel="stylesheet" href="' + paths.cssBootstrap + '" />\n' +
    '  <link rel="stylesheet" href="' + paths.cssHighlight + '">\n';
  var foot = '\n' +
    '  <script src="' + paths.jsHighlight + '"></script>\n' +
    '  <script>hljs.initHighlightingOnLoad();</script>\n';

  function wrap( title, body ) {
    return '<html>\n<head>' + head + '</head>\n<style>\n' + css + '\n</style>\n\n' +
      '<h1>' + title + '</h1>\n' +
      '<p><i>' + pkgInfo.name + ' v' + pkgInfo.version + '</i></p>\n' +
      body + foot + '\n</body>\n</html>\n';
  }

  // Set up developer paths.
  PATH.init( paths.RandD );

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

  // Lists all languages.
  app.get( PATH.list.languages, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Languages',
      filingCabinet.listLanguages() +
      backToRoot() ) );
  } );

  // Lists all documents.
  app.get( PATH.list.documents, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Documents',
      filingCabinet.documents.list( PATH.show.document ) +
      backToRoot() ) );
  } );

  // Display a document.
  app.get( PATH.show.document + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Document: ' + show( key ),
      filingCabinet.documents.show( key ) +
      backTo( PATH.list.documents ) ) );
  } );

  // Lists all layouts.
  app.get( PATH.list.layouts, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Layouts',
      filingCabinet.layouts.list( PATH.show.layout ) +
      backToRoot() ) );
  } );

  // Display a layout.
  app.get( PATH.show.layout + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Layout: ' + show( key ),
      filingCabinet.layouts.show( key ) +
      backTo( PATH.list.layouts ) ) );
  } );

  // Lists all segments.
  app.get( PATH.list.segments, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Segments',
      filingCabinet.segments.list( PATH.show.segment ) +
      backToRoot() ) );
  } );

  // Display a segment.
  app.get( PATH.show.segment + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Segment: ' + show( key ),
      filingCabinet.segments.show( key ) +
      backTo( PATH.list.segments ) ) );
  } );

  // Lists all contents.
  app.get( PATH.list.contents, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Contents',
      filingCabinet.contents.list( PATH.show.content ) +
      backToRoot() ) );
  } );

  // Display a content.
  app.get( PATH.show.content + '/:language/:key', function ( req, res ) {
    var language = req.params[ 'language' ];
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Content: ' + show( key ),
      filingCabinet.contents.show( language, key ) +
      backTo( PATH.list.contents ) ) );
  } );

  // Lists all menus.
  app.get( PATH.list.menus, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Menus',
      filingCabinet.menus.list( PATH.show.menu ) +
      backToRoot() ) );
  } );

  // Display a menu.
  app.get( PATH.show.menu + '/:language/:key', function ( req, res ) {
    var language = req.params[ 'language' ];
    var key = req.params[ 'key' ];
    var result = filingCabinet.menus.show( language, +key );
    res.status( 200 ).send( wrap( 'Menu: ' + show( result.title ),
      result.list +
      backTo( PATH.list.menus ) ) );
  } );

  // Lists all locales.
  app.get( PATH.list.locales, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Locales',
      filingCabinet.locales.list( filingCabinet.languages ) +
      backToRoot() ) );
  } );

  // Lists all references.
  app.get( PATH.list.references, function ( req, res ) {
    res.status( 200 ).send( wrap( 'References',
      filingCabinet.references.list( PATH.show.reference ) +
      backToRoot() ) );
  } );

  // Display a reference.
  app.get( PATH.show.reference + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Reference: ' + show( key ),
      filingCabinet.references.show( key ) +
      backTo( PATH.list.references ) ) );
  } );

  // Lists all controls.
  app.get( PATH.list.controls, function ( req, res ) {
    res.status( 200 ).send( wrap( 'Controls',
      filingCabinet.controls.list( PATH.show.control ) +
      backToRoot() ) );
  } );

  // Display a control.
  app.get( PATH.show.control + '/:key', function ( req, res ) {
    var key = PATH.unsafe( req.params[ 'key' ] );
    res.status( 200 ).send( wrap( 'Control: ' + show( key ),
      filingCabinet.controls.show( key ) +
      backTo( PATH.list.controls ) ) );
  } );
}

module.exports = setDeveloperRoutes;
