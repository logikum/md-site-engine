'use strict';

var debug = require( 'debug' )( 'md-site-engine' );

/**
 * Smart logger.
 */
var logger = {
  /**
   * Writes when a locale found.
   * @param {string} typeName - The type of the locale: content|component
   * @param {string} locale - The name of the locale.
   */
  localeFound: function ( typeName, locale ) {
    debug( '%s locale: %s', typeName, locale );
  },

  /**
   * Writes when an evaluable file found.
   * @param {string} typeName - The type of the file:
   *    content|document|layout|segment|reference|locale|control
   * @param {string} fileName - The name of the file.
   */
  fileProcessed: function ( typeName, fileName ) {
    debug( '%s processed: %s', typeName, fileName );
  },

  /**
   * Writes when an not processable file found.
   * @param {string} typeName - The type of the file: content|component|control
   * @param {string} fileName - The name of the file.
   */
  fileSkipped: function ( typeName, fileName ) {
    debug( '%s skipped: %s', typeName, fileName );
  },

  /**
   * Writes when a menu found for a content.
   * @param {string} menuPath - The base URL of the content.
   */
  menuAdded: function ( menuPath ) {
    debug( 'Menu item added: %s', menuPath );
  },

  /**
   * Writes a route added to the router.
   * @param {string} url - The URL of the route.
   * @param {string} [method=GET] - The method of the route.
   */
  routeAdded: function ( url, method ) {
    debug( 'Route added: %s %s', method || 'GET', url );
  },

  /**
   * Writes when an element group is finalized.
   * @param {string} groupName - The name of the element group.
   */
  ready: function ( groupName ) {
    debug( '%s are initialized.', groupName );
  },

  /**
   * Writes an information message.
   * @param {string} message - The text of the information.
   * @param {*} [arg] - An optional argument.
   */
  showInfo: function ( message, arg ) {
    if (arg)
      debug( message, arg );
    else
      debug( message );
  },

  /**
   * Writes a warning message.
   * @param {string} message - The text of the warning.
   */
  showWarning: function ( message ) {
    console.log( 'md-site-engine * WARNING - %s', message );
  },

  /**
   * Writes an error message.
   * @param {string} message - The text of the error.
   */
  showError: function ( message ) {
    console.log( 'md-site-engine * ERROR - %s', message);
  }
};

module.exports = logger;
