'use strict';

/**
 * Utility to create context objects for controls.
 * @param {Configuration} config - The configuration object.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @constructor
 */
var ContextFactory = function( config, filingCabinet ) {

  function xlate( language, key ) {
    return filingCabinet.locales.get( language, key );
  }

  // Create the fixed part of the contexts.
  var proto = {
    config: config,
    languages: filingCabinet.languages,

    t: function ( key ) {
      return xlate( this.language, key );
    },
    translate: function ( key ) {
      return xlate( this.language, key );
    },
    getSearchResults: function() {
      return filingCabinet.contents.search( this.language, this.text2search );
    }
  };

  /**
   * Creates a context object for controls.
   * @param {string} language - The current language.
   * @param {string} baseUrl - The URL path on which a router instance was mounted.
   * @param {Metadata} definition - The metadata of the current path.
   */
  this.create = function ( language, baseUrl, definition ) {

    // Create the context.
    var context = Object.assign( {
      language:language,
      baseUrl: baseUrl,
      metadata: definition,
      menus: filingCabinet.menus.get( language ),
      text2search: filingCabinet.text2search,
      searchPath: filingCabinet.contents.searchPath( language )
    }, proto );

    // Immutable object.
    Object.freeze( context );

    return context;
  }
};

module.exports = ContextFactory;
