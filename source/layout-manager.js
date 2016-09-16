'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var marked = require( 'marked' );
var i18n = require( './i18n.js' );
var getRenderer = require( './marked-renderer.js' );

var MAIN = '{{main}}';
var CONTENT = '{{content}}';

var renderer = getRenderer( marked );

//region Helper

function getRE( pattern ) {
  var re = new RegExp( pattern.replace( /\{/g, '\\{' ), 'g' );
  //var src = re.source;
  return re;
}

function merge( first, second, separator ) {
  var merged = first || '';
  merged += second ? separator + second : '';
  return merged;
}

//endregion

//region Initialization

function initialize( config, layouts, components, plugins ) {
  var layoutsPath = path.join( process.cwd(), config.content.layouts );

  // Find document file.
  getDocument(
    layouts,
    layoutsPath,
    config.content.documentFile,
    true
  );

  // Find layouts.
  getLayouts(
    layouts,
    null,
    layoutsPath,
    config.content.layoutFile,
    config.content.documentFile,
    true
  );

  // Read subdirectory items as language containers.
  var items = fs.readdirSync( layoutsPath );
  items.forEach( function ( item ) {

    // Get full path of item.
    var itemPath = path.join( layoutsPath, item );

    // Get item info.
    var stats = fs.statSync( itemPath );

    if (stats.isDirectory()) {
      // Create new placeholders for the language.
      layouts[ item ] = {};
      components[ item ] = {};

      // Find document file.
      getDocument(
        layouts[ item ],
        itemPath,
        config.content.documentFile,
        false
      );

      // Find components.
      getComponents( components[ item ], itemPath, '' );

      // Find layouts.
      getLayouts(
        layouts[ item ],
        components[ item ],
        itemPath,
        config.content.layoutFile,
        config.content.documentFile,
        false
      );
    }
  } );

  // Find and add engine plugins.
  getPlugins( plugins, '/node_modules/md-site-engine/plugins' );

  // Find and add user plugins.
  getPlugins( plugins, config.content.plugins );
}

function getDocument( docStore, documentDir, documentFile, isRequired ) {

  try {
    // Get document info.
    var documentPath = path.join( documentDir, documentFile );
    var stats = fs.statSync( documentPath );

    if (stats.isFile()) {
      var document = fs.readFileSync( documentPath, { encoding: 'utf8' } );

      // Find tokens.
      var re = /(\{\{[#]?[\w-]+}})/g;
      var tokens = [];
      var j = 0;
      for (var matches = re.exec( document ); matches != null; matches = re.exec( document )) {
        tokens[ j++ ] = matches[ 1 ];
      }
      // Store document with tokens.
      docStore.document = {
        text: document,
        tokens: tokens
      };
    }
  }
  catch( err ) {
    if (isRequired)
      throw new Error( 'Document file not found: ' + documentPath );
  }
}

function getComponents( itemStore, itemDir, levelPath ) {
  // Read directory items.
  var items = fs.readdirSync( itemDir );

  items.forEach( function ( item ) {
    var itemPath = path.join( itemDir, item );
    var prefix = levelPath === '' ? '' : levelPath + '/';

    // Get item info.
    var stats = fs.statSync( itemPath );

    if (stats.isDirectory()) {

      // Get sublevel components.
      getComponents( itemStore, itemPath, prefix + item );
    } else
    if (stats.isFile() && path.extname( item ) === '.md') {

      // Read, convert and store the markdown file.
      var itemKey = prefix + path.basename( item, '.md' );

      // Get file content.
      var text = fs.readFileSync( itemPath, { encoding: 'utf-8' } );

      // Convert content.
      text = marked( text, { renderer: renderer } );

      // Store content.
      itemStore[ itemKey ] = text;
    }
  } );
}

function getLayouts( itemStore, partStore, itemDir, layoutFile, documentFile, isDefault ) {
  //var hasDefault = false;
  //var layoutFile = config.content.layoutFile; // default layout file

  // Read directory items.
  var items = fs.readdirSync( itemDir );

  for (var i = 0; i < items.length; i++) {
    var item = items[ i ];
    var itemPath = path.join( itemDir, item );

    // Get item info.
    var stats = fs.statSync( itemPath );

    if (stats.isFile() && path.extname( item ) === '.html' && path.basename( item ) !== documentFile ) {

      // Read, process and store the layout file.
      var basename = path.basename( item, '.html' );

      // Get file content.
      var text = fs.readFileSync( itemPath, { encoding: 'utf8' } );

      // Find tokens.
      var re = /(\{\{[=#]?[\w-]+}})/g;
      var tokens = [];
      var j = 0;
      for (var matches = re.exec( text ); matches != null; matches = re.exec( text )) {
        tokens[ j++ ] = matches[ 1 ];
      }

      // Insert static parts into the layout.
      if (!isDefault) {
        var parts = [];
        tokens.forEach( function ( token ) {
          if (token[ 2 ] === '=') {
            var partName = token.substring( 3, token.length - 2 );
            text = text.replace( getRE( token ), partStore[ partName ] || '' );
          }
          else
            parts.push( token )
        } );
      }

      // Store content with component names.
      itemStore[ basename ] = {
        text: text,
        parts: parts
      };

      // // Check default layout.
      // if (item == layoutFile)
      //   hasDefault = true;
    }
  }
  // // Default layout has found?
  // if (!hasDefault)
  //   throw new Error( 'Default layout file not found: ' + path.join( itemDir, layoutFile ) );
}

function getPlugins( plugins, pluginDir ) {
  var pluginsPath = path.join( process.cwd(), pluginDir );

  // Read directory items.
  var items = fs.readdirSync( pluginsPath );
  items.forEach( function ( item ) {
    var itemPath = path.join( pluginsPath, item );

    // Get item info.
    var stats = fs.statSync( itemPath );

    if (stats.isFile() && path.extname( item ) === '.js') {

      // Read and store the JavaScript file.
      var basename = path.basename( item, '.js' );

      // Get file content.
      var plugin = require( itemPath );

      // Store content.
      plugins[ basename ] = plugin;
    }
  } );

  // Add default plugin.
  plugins._doNothing = function ( ctx ) {
    return '--- missing plug-in ---'
  }
}

//endregion

var LayoutManager = function ( config, menus ) {

  i18n.setup( config.content.locales );

  var languages = [];
  var layouts = {};
  var components = {};
  var plugins = {};
  var documentName = path.basename( config.content.documentFile, '.html' );
  var layoutName = path.basename( config.content.layoutFile, '.html' );

  initialize( config, layouts, components, plugins );

  // Collect languages.
  for (var prop in menus) {
    if (menus.hasOwnProperty( prop )) {
      languages.push( prop );
    }
  }

  //region Function get()

  this.get = function ( baseUrl, language, definition, content ) {

    var layoutStore = layouts[ language ];
    var componentStore = components[ language ];

    if (layoutStore && componentStore) {
      var t = i18n.getText( language, 'layout' );

      // Create context for document plug-ins.
      var context = {
        config: config,
        baseUrl: baseUrl,
        language: language,
        definition: definition,
        texts: t
      };

      // Get document.
      var document = layoutStore[ documentName ] || layouts[ documentName ];
      var body = document.text;

      // Substitute document tokens with their values.
      document.tokens.forEach( function ( token ) {
        if (token !== MAIN) {
          var pluginName = token.substring( 2, token.length - 2 );
          if (pluginName[ 0 ] == '#')
            pluginName = pluginName.substring( 1 );
          var plugin = plugins[ pluginName ] || plugins._doNothing;
          body = body.replace( getRE( token ), plugin( context ) );
        }
      } );

      // Extend context for layout plug-ins.
      context.languages = languages;
      context.layouts = layoutStore;
      context.components = componentStore;
      context.menus = menus[ language ];

      // Get layout.
      var layout =
        layoutStore[ definition.layout ] || layouts[ definition.layout ] ||
        layoutStore[ layoutName ] || layouts[ layoutName ];

      // Substitute layout tokens with their values.
      var text = layout.text;
      layout.parts.forEach( function( token ) {
        if (token === CONTENT) {
          text = text.replace( getRE( CONTENT ), content );
        }
        else if (token[ 2 ] == '#') {
          var pluginName = token.substring( 3, token.length - 2 );
          var plugin = plugins[ pluginName ] || plugins._doNothing;
          text = text.replace( getRE( token ), plugin( context ) );
        }
        else {
          var partName = token.substring( 2, token.length - 2 );
          text = text.replace( getRE( token ), componentStore[ definition[ partName ] ] || '' );
        }
      } );

      return body.replace( getRE( MAIN ), text );
    } else
      return '<html><head></head><body>Unknown language: ' + language + '</body></html>';
  };

  //endregion
};

module.exports = LayoutManager;
