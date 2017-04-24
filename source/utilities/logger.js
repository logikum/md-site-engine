'use strict';

var colors = require( 'colors/safe' );

colors.setTheme({
  locale: 'blue',
  processed: 'green',
  skipped: 'magenta',
  menu: 'cyan',
  info: 'blue',
  warning: 'magenta',
  error: 'red'
});

/**
 * Color logger.
 */
var log = {
  /**
   * Writes when a locale found.
   * @param {string} typeName - The type of the locale: content|component
   * @param {string} locale - The name of the locale.
   */
  localeFound: function ( typeName, locale ) {
    console.log( colors.locale( '%s locale: %s' ), typeName, locale );
  },

  /**
   * Writes when an evaluable file found.
   * @param {string} typeName - The type of the file:
   *    content|document|layout|segment|reference|locale|control
   * @param {string} fileName - The name of the file.
   */
  fileProcessed: function ( typeName, fileName ) {
    console.log( colors.processed( '%s processed: %s' ), typeName, fileName );
  },

  /**
   * Writes when an not processable file found.
   * @param {string} typeName - The type of the file: content|component|control
   * @param {string} fileName - The name of the file.
   */
  fileSkipped: function ( typeName, fileName ) {
    console.log( colors.skipped( '%s skipped: %s' ), typeName, fileName );
  },

  /**
   * Writes when a menu found for a content.
   * @param {string} menuPath - The base URL of the content.
   */
  menuAdded: function ( menuPath ) {
    console.log( colors.menu( 'Menu item added: %s' ), menuPath );
  },

  /**
   * Writes an information message.
   * @param {string} message - The text of the information.
   */
  showInfo: function ( message ) {
    console.log( colors.info( message ) );
  },

  /**
   * Writes a warning message.
   * @param {string} message - The text of the warning.
   */
  showWarning: function ( message ) {
    console.log( colors.warning( message ) );
  },

  /**
   * Writes an error message.
   * @param {string} message - The text of the error.
   */
  showError: function ( message ) {
    console.log( colors.error( message ) );
  }
};

module.exports = log;


