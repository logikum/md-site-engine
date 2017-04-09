'use strict';

var logger = require( '../utilities/logger.js' );

var LocaleDrawer = function( defaultLanguage ) {

  var locales = { };

  this.add = function ( prefix, items ) {

    // Store the locale items.
    var localePath = prefix.replace( '/', ':' ).replace( /\//g, '.' );
    for (var name in items) {
      var key = localePath + name;
      if (locales[ key ])
        logger.showWarning( 'Locale "' + key + '" has been overwritten.');
      locales[ key ] = items[ name ];
    }
  };

  this.get = function ( language, key ) {

    // Try language specific locale.
    var langKey = language + ':' + key;
    if (locales[ langKey ] !== undefined)
      // The requested language locale is found.
      return locales[ langKey ];

    // Try the default locale.
    if (language !== defaultLanguage) {
      var dfltKey = defaultLanguage + ':' + key;
      if (locales[ dfltKey ] !== undefined)
        // The default locale is found.
        return locales[ dfltKey ];
    }
    // The requested locale is not found.
    logger.showError( 'Locale "' + key + '" is not found.' );

    // Return an empty string.
    return '';
  };

  //region Developer methods

  this.list = function ( languages ) {
    var list = '';
    languages.forEach( function( language ) {
      var len = language.length + 1;

      list += '<h3>' + language + '</h3>\n';
      list += '<ul>\n';
      for (var key in locales) {
        if (key.substring( 0, len ) === language + ':')
          list += '<li><b>' + key.substring( len ) + '</b>: ' + locales[ key ] + '</li>\n';
      }
      list += '</ul>\n';
    } );
    return list;
  };

  //endregion
};

module.exports = LocaleDrawer;
