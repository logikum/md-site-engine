'use strict';

/**
 * Represents the context prototype.
 * @param {Configuration} config - The configuration object.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @constructor
 */
var ContextProto = function( config, filingCabinet ) {

  /**
   * Gets the configuration object.
   * @type {Configuration}
   * @readonly
   */
  this.config = config;

  /**
   * Gets the list of languages.
   * @type {Array.<string>}
   * @readonly
   */
  this.languages = filingCabinet.languages;

  /**
   * Gets the localized text of the key in the current language.
   * It is the same as ContextProto.translate().
   * @param {string} key - The key of the requested locale.
   * @param {string} defaultValue - The default value if the locale does not exist.
   * @returns {string} The localized text.
   */
  this.t = function( key, defaultValue ) {

    return filingCabinet.locales.get( this.language, key, defaultValue );
  };

  /**
   * Gets the localized text of the key in the current language.
   * It is the same as ContextProto.t().
   * @param {string} key - The key of the requested locale.
   * @param {string} defaultValue - The default value if the locale does not exist.
   * @returns {string} The localized text.
   */
  this.translate = function( key, defaultValue ) {

    return filingCabinet.locales.get( this.language, key, defaultValue );
  };
};

module.exports = ContextProto;
