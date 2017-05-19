'use strict';

var ContentStock = require( './content-stock.js' );
var SearchResultList = require( './../models/search-result-list.js' );
var logger = require( './../utilities/logger.js' );

/**
 * Represents a storage for contents.
 * @param {string} defaultLanguage - The default language.
 * @param {string} path404 - The path of the content not found page.
 * @param {string} pathSearch - The path of the search page.
 * @constructor
 */
var ContentDrawer = function( defaultLanguage, path404, pathSearch ) {

  var contents = { };

  //region Methods

  /**
   * Creates and returns a new content store for a language.
   * @param {string} language - The language of the store.
   * @returns {ContentStock} The content store of the language.
   */
  this.create = function( language ) {

    // Create a content stock for the language.
    contents[ language ] = new ContentStock( path404, pathSearch );

    // Return the content stock created.
    return contents[ language ];
  };

  /**
   * Returns the content of the requested path and language.
   * @param {string} language - The language of the content.
   * @param {string} path - The path of the content.
   * @returns {Content} The requested content object.
   */
  this.getContent = function( language, path ) {

    // Try the requested language.
    if (contents[ language ] !== undefined)
      return contents[ language ].getContent( path );

    // Try the default language.
    else
      return contents[ defaultLanguage ].getContent( path );
  };

  /**
   * Returns the metadata of the content of the requested path and language.
   * @param {string} language - The language of the content.
   * @param {string} path - The path of the content.
   * @returns {Metadata} The requested metadata object.
   */
  this.getDefinition = function( language, path ) {

    // Try the requested language.
    if (contents[ language ] !== undefined)
      return contents[ language ].getDefinition( path );

    // Try the default language.
    else
      return contents[ defaultLanguage ].getDefinition( path );
  };

  /**
   * Determines and returns the path of a content of a given language in another
   * language.
   * @param {string} curLanguage - The current language of the content.
   * @param {string} baseUrl - The current path of the content.
   * @param {string} newLanguage - The requested language of the content.
   * @returns {string} The path of the content in the requested language.
   */
  this.getLocalizedPath = function( curLanguage, baseUrl, newLanguage ) {
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

  /**
   * Gets the localized path of the context having the passed identifier.
   * @param {string} language - The current language.
   * @param {string} id - The identifier of the content.
   */
  this.getPathById = function( language, id ) {

    return contents[ language ].getPathById( id );
  };

  //endregion

  //region Search

  /**
   * Returns the path of the search page in the requested language.
   * @param {string} language - The requested language of the search page.
   * @returns {string} The requested path.
   */
  this.searchPath = function( language ) {

    // Does search result page exist?
    return contents[ language ].searchPath();
  };

  /**
   * Return the list of the contents matching the search phrase.
   * @param {Context} context - The context of the request.
   * @returns {Array.<SearchResult>} The list of matching contents.
   */
  this.search = function( context ) {

    var results = new SearchResultList(
      context.data.text2search,
      context.t( 'noSearchPhrase' ),
      context.t( 'noSearchResult' )
    );

    // Get search results
    if (results.text2search)
      return contents[ context.language ].search( results );
    else
      return results;
  };

  //endregion

  //region Validation

  /**
   * Returns the metadata of a content.
   * @param {string} language - The language of the content.
   * @param {string} id - The identifier of the content.
   * @returns {Metadata} The requested metadata.
   */
  this.findDefinition = function( language, id ) {

    return contents[ language ].findDefinition( id );
  };

  /**
   * Makes final steps on the contents:
   *    * Validate tokens.
   *    * Insert static segments into contents.
   *    * Create searchable texts.
   * @param {SegmentDrawer} segments - The segment storage.
   * @param {ControlDrawer} controls - The control storage.
   */
  this.finalize = function( segments, controls ) {

    // Insert static segments into contents.
    for (var language in contents) {
      contents[ language ].finalize( language, segments, controls );
    }

    logger.ready( 'Contents' );
  };

  //endregion

  //region Developer methods

  /**
   * Returns the list of the contents.
   * @param {string} itemPath - The base URL of the details page.
   * @returns {string} The list of the contents in HTML format.
   */
  this.list = function( itemPath ) {
    var list = '';

    Object.getOwnPropertyNames( contents )
      .sort()
      .forEach( function( language ) {
        list += '<h3>' + language + '</h3>\n';
        list += contents[ language ].list( language, itemPath );
      } );
    return list;
  };

  /**
   * Returns the details of a content.
   * @param {string} language - The language of the content.
   * @param {string} key - The path of the content.
   * @returns {string} The details of the content in HTML format.
   */
  this.show = function( language, key ) {

    return contents[ language ].show( key );
  };

  //endregion
};

module.exports = ContentDrawer;
