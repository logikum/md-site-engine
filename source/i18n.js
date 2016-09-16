'use strict';

var fs = require( 'fs' );
var path = require( 'path' );

var locales = {};

//region Locale reading

function addLocales( container, localeDir ) {

  // Read directory items.
  var items = fs.readdirSync( localeDir );

  items.forEach( function ( item ) {

    // Get full path of item.
    var itemPath = path.join( localeDir, item );
    // Get item info.
    var stats = fs.statSync( itemPath );

    if (stats.isDirectory()) {
      container[ item ] = {};
      // Read subdirectory.
      addContents( container[ item ], itemPath );
    }
    else if (stats.isFile() && path.extname( item ) === '.json') {
      // Read and store the locale file.
      var basename = path.basename( item, '.json' );
      // Get locale collection.
      container[ basename ] = require( itemPath );
    }
  } );
}

//endregion

//region Initialization

function setup( localesDir ) {

  var localesPath = path.join( process.cwd(), localesDir );

  // Read subdirectory items as language containers.
  var items = fs.readdirSync( localesPath );
  items.forEach( function ( item ) {

    // Get full path of item.
    var itemPath = path.join( localesPath, item );
    // Get item info.
    var stats = fs.statSync( itemPath );

    if (stats.isDirectory()) {
      // Create new managers for the language.
      locales[ item ] = {};
      // Find and add localization strings.
      addLocales( locales[ item ], itemPath );
    }
  } );
}

//endregion

//region Get localized text

function getText( language, keyPath ) {
  var current = locales;

  var keys = [ language ];
  keyPath.split( '.' ).forEach( function ( key ) {
    keys.push( key );
  } );

  for (var i = 0; i < keys.length; i++) {
    var key = keys[ i ];
    if (current[ key ])
      current = current[ key ];
    else
      break;
  }
  return current;
}

//endregion

module.exports = {
  setup: setup,
  getText: getText
};
