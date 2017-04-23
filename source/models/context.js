'use strict';

/**
 * Represents the context for controls.
 * @param {ContextProto} proto - The prototype of the context.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @param {string} language - The current language.
 * @param {string} baseUrl - The URL path on which a router instance was mounted.
 * @param {Metadata} definition - The metadata of the current path.
 * @constructor
 */
var Context = function( proto, filingCabinet, language, baseUrl, definition ) {

  Object.assign( this, proto );

  /**
   * Gets the current language.
   * @type {string}
   * @readonly
   */
  this.language = language;

  /**
   * Gets the URL path on which a router instance was mounted.
   * @type {string}
   * @readonly
   */
  this.baseUrl = baseUrl;

  /**
   * Gets the metadata of the current content.
   * @type {Metadata}
   * @readonly
   */
  this.metadata = definition;

  /**
   * Gets the menu tree of the current language.
   * @type {MenuStock}
   * @readonly
   */
  this.menus = filingCabinet.menus.get( language );

  /**
   * Gets the text to search.
   * @type {string}
   * @readonly
   */
  this.text2search = filingCabinet.text2search;

  /**
   * Gets the path of the search command.
   * @type {string}
   * @readonly
   */
  this.searchPath = filingCabinet.contents.searchPath( language );
};

module.exports = Context;
