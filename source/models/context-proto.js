'use strict';

/**
 * Represents the context prototype.
 * @param {Configuration} config - The configuration object.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @constructor
 */
var ContextProto = function( config, filingCabinet ) {

  function xlate( language, key ) {

    return filingCabinet.locales.get( language, key );
  }

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
   * @returns {string}
   */
  this.t = function( key ) {

    return xlate( this.language, key );
  };

  /**
   * Gets the localized text of the key in the current language.
   * It is the same as ContextProto.t().
   * @param {string} key - The key of the requested locale.
   * @returns {string}
   */
  this.translate = function( key ) {

    return xlate( this.language, key );
  };
};

module.exports = ContextProto;
