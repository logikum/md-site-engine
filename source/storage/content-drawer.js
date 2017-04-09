'use strict';

var ContentStock = require( './content-stock.js' );

var ContentDrawer = function( defaultLanguage ) {

  var contents = { };

  this.create = function ( language ) {

    // Create a content stock for the language.
    contents[ language ] = new ContentStock();

    // Return the content stock created.
    return contents[ language ];
  };

  this.getContent = function ( language, path ) {

    // Try the requested language.
    if (contents[ language ] !== undefined)
      return contents[ language ].getContent( path );

    // Try the default language.
    else
      return contents[ defaultLanguage ].getContent( path );
  };

  this.getDefinition = function ( language, path ) {

    // Try the requested language.
    if (contents[ language ] !== undefined)
      return contents[ language ].getDefinition( path );

    // Try the default language.
    else
      return contents[ defaultLanguage ].getDefinition( path );
  };

  this.getLocalizedPath = function ( curLanguage, baseUrl, newLanguage ) {
    var localizedPath = '/';

    // Find the definition of the current content.
    var curDefinition = contents[ curLanguage ].getDefinition( baseUrl );
    if (curDefinition.id) {
      // Check the availability of the content in the new language.
      var newDefinition = contents[ newLanguage ].findDefinition( curDefinition.id );
      if (newDefinition.path)
        localizedPath = newDefinition.path;
    }

    return localizedPath;
  };

  //region Validation

  this.findDefinition = function ( language, path ) {
    return contents[ language ].findDefinition( path );
  };

  this.finalize = function ( segments, controls ) {

    // Insert static segments into contents.
    for (var language in contents) {
      contents[ language ].finalize( language, segments, controls );
    }
  };

  //endregion

  //region Developer methods

  this.list = function ( itemPath ) {
    var list = '';
    for (var language in contents) {
      list += '<h3>' + language + '</h3>\n';
      list += contents[ language ].list( language, itemPath );
    }
    return list;
  };

  this.show = function ( language, key ) {
    return contents[ language ].show( key );
  };

  //endregion
};

module.exports = ContentDrawer;
