'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var marked = require( 'marked' );
var getRenderer = require( './marked-renderer.js' );
var referenceReader = require( './reference-reader.js' );
var LayoutManager = require( './layout-store.js' );
var ContentStore = require( './content-store.js' );
var MenuStore = require( './menu-store.js' );

var renderer = getRenderer( marked );

function ContentManager( config ) {

  var self = this;
  var contentDir = config.content.contents;
  var contentsPath = path.join( process.cwd(), contentDir );
  var layout = null;
  var contents = {};
  var menus = {};

  //region Menu building

  function createMenuItem( menu, definition, contentPath, isDirectory ) {

    // Default values for item properties,
    var order = parseInt( definition.order || 1, 10 );
    var text = definition.text || '-?-';
    var umbel = definition.umbel && definition.umbel.toLowerCase() == 'true';
    if (isNaN( order )) {
      order = 0;
      text = '* ' + text;
    }
    var hidden = definition.hidden && definition.hidden.toLowerCase() === 'true';

    if (isDirectory) {
      // Add sub-menu item.
      return menu.branch( text, order, hidden );
    }
    // Omit hidden item.
    else if (!hidden) {
      // Add menu item.
      var path = contentPath;
      var length = path.length;
      if (length >= 6 && path.substr( -6 ) === '/index') {
        // Cut down closing index.
        var end = length > 6 ? 6 : 5;
        path = path.substr( 0, length - end );
      }
      menu.add( text, order, path, umbel );
    }
  }

  function readDefinition( context ) {
    var definition = {};
    var lines = context.text.split( '\n' );

    // Starts with menu info?
    if (lines.length && lines[ 0 ].substring( 0, 4 ) === '<!--') {

      var line = lines.shift();
      var canDo = true;
      var key;

      // Build menu definition.
      do {
        line = lines.shift();
        // End of definition?
        if (!line || /-->[\n\r]/.test( line ) )
          canDo = false;
        // Comment?
        else if (line.substring( 0, 3 ) === '---')
          ;
        // Continue previous item?
        else if (line.substring( 0, 3 ) === '   ') {
          if (key)
            definition[ key ] = definition[ key ].trim() + ' ' + line.substring( 3 ).trim();
        }
        // New key-value pair?
        else {
          var pair = line.split( ':' );
          if (pair.length > 1) {
            key = pair[ 0 ].trim();
            definition[ key ] = pair[ 1 ].trim();
          }
        }
      } while (canDo);

      context.text = lines.join( '\n' );
    }
    return definition;
  }

  function buildSubMenu( menu, itemPath, contentPath ) {
    // Get sub-menu info.
    try {
      var stats = fs.statSync( itemPath );
      if (stats && stats.isFile()) {
        var context = {};

        // Read sub-menu info.
        context.text = fs.readFileSync( itemPath, { encoding: 'utf8' } );
        // Read definition.
        var definition = readDefinition( context );

        // Create sub-menu item.
        return createMenuItem( menu, definition, contentPath, true );
      }
    } catch (err) {
      console.log( err.message );
    }
  }

  //endregion

  //region Content reading

  function addContents( cm, contentDir, contentRoot, menuNode, references ) {

    // Read directory items.
    var items = fs.readdirSync( contentDir );

    items.forEach( function ( item ) {

      // Get full path of item.
      var itemPath = path.join( contentDir, item );
      // Get item info.
      var stats = fs.statSync( itemPath );

      if (stats.isDirectory()) {

        // Determine content path.
        var directoryPath = contentRoot + '/' + item;
        // Create menu item.
        var directoryNode = buildSubMenu( menuNode, itemPath + '.menu', directoryPath );

        // Read subdirectory.
        if (directoryNode)
          addContents( cm, itemPath, directoryPath, directoryNode.children, references );
        else
          addContents( cm, itemPath, directoryPath, menuNode, references );
      }
      else if (stats.isFile() && path.extname( item ) === '.md') {
        var context = {};

        // Read, convert and store the markdown file.
        var basename = path.basename( item, '.md' );
        // Determine content path.
        context.path = contentRoot + '/' + basename;
        // Get content.
        context.text = fs.readFileSync( itemPath, { encoding: 'utf-8' } );

        // Read definition.
        var definition = readDefinition( context );
        // Contains menu info?
        if (definition.order || definition.text)
        // Create menu item.
          createMenuItem( menuNode, definition, context.path, false );

        // Generate HTML from markdown text.
        if (definition.text !== '---') {
          // Convert content.
          var html = marked( context.text + references, { renderer: renderer } );
          // Store content.
          cm.add( html, definition, context.path );
        }
      }
    } );
  }

  //endregion

  //region Initialization

  function initialize() {

    var references = null;
    // Get general references.
    if (config.content.referenceFile.charAt( 0 ) != '~')
      references = referenceReader( path.join( contentDir, config.content.referenceFile ) );

    // Read subdirectory items as language containers.
    var items = fs.readdirSync( contentsPath );
    items.forEach( function ( item ) {

      // Get full path of item.
      var itemPath = path.join( contentsPath, item );
      // Get item info.
      var stats = fs.statSync( itemPath );

      if (stats.isDirectory()) {
        // Create new stores for the language.
        contents[ item ] = new ContentStore();
        menus[ item ] = new MenuStore();

        // Get language specific references.
        if (config.content.referenceFile.charAt( 0 ) == '~')
          references = referenceReader( path.join(
            contentDir,
            item + config.content.referenceFile.substr( 1 )
          ) );

        // Find and add markdown contents.
        addContents( contents[ item ], itemPath, '', menus[ item ], references );
      }
    } );

    layout = new LayoutManager( config, menus );
  }

  //endregion

  initialize();

  //region Public methods

  this.get = function ( path, language ) {
    var store = contents[ language ];
    return store ?
      layout.get( path, language, store.getDefinition( path ), store.getContent( path ) ) :
      'Unknown language: ' + language;
  };

  this.restart = function ( language ) {
    layout = null;
    contents = {};
    menus = {};

    initialize();

    return self.get( '/', language );
  };

  this.setRoutes = function ( app ) {

    // Set up language.
    app.use( function ( req, res, next ) {
      if (!req.session) {
        req.session = { language: config.locale.default };
      } else if (!req.session.language) {
        req.session.language = config.locale.default;
      }
      next();
    } );

    // Change language.
    app.use( '/set-language', function ( req, res, next ) {
      req.session.language = req.url.length > 1 ? req.url.substr( 1 ) : config.locale.default;
      res.redirect( '/' );
    } );

    // Reread the contents.
    app.use( '/restart', function ( req, res, next ) {
      res.status( 200 ).send( self.restart( req.session.language ) );
    } );

    // Serve markdown contents.
    app.use( '*', function ( req, res, next ) {
      res.status( 200 ).send( self.get( req.baseUrl, req.session.language ) );
    } );
  };

  //endregion
}

module.exports = ContentManager;
