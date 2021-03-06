'use strict';

var logger = require( './../utilities/logger.js' );

var LocaleDrawer = function( defaultLanguage ) {

  var locales = { };

  //region Methods

  /**
   * Stores a locale collection.
   * @param {string} prefix - The identifier of the locale collection.
   * @param {object} items - The object of the locale collection.
   */
  this.add = function( prefix, items ) {

    // Store the locale items.
    var localePath = prefix.replace( '/', ':' ).replace( /\//g, '.' );
    for (var name in items) {
      var key = localePath + name;
      if (locales[ key ])
        logger.showWarning( 'Locale "' + key + '" has been overwritten.');
      locales[ key ] = items[ name ];
    }
  };

  /**
   * Returns a locale.
   * @param {string} language - The language of the locale.
   * @param {string} key - The identifier of the locale.
   * @param {string} defaultValue - The default value if the locale does not exist.
   * @returns {string} The requested locale.
   */
  this.get = function( language, key, defaultValue ) {

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
    // Is a default value supplied?
    if (defaultValue)
      return defaultValue;

    // The requested locale is not found.
    logger.showError( 'Locale "' + key + '" is not found.' );

    // Return an empty string.
    return '';
  };

  //endregion

  //region Developer methods

  /**
   * Returns the list of the locales.
   * @param {Array.<string>} languages - The list of languages.
   * @returns {string} The list of the locales in HTML format.
   */
  this.list = function( languages ) {
    var list = '';

    languages.forEach( function( language ) {
      var len = language.length + 1;

      list += '<h3>' + language + '</h3>\n';
      list += '<ul>\n';
      Object.getOwnPropertyNames( locales )
        .sort()
        .forEach( function( key ) {
          if (key.substring( 0, len ) === language + ':')
            list += '<li><b>' + key.substring( len ) + '</b>: ' + locales[ key ] + '</li>\n';
        } );
      list += '</ul>\n';
    } );
    return list;
  };

  //endregion
};

module.exports = LocaleDrawer;
