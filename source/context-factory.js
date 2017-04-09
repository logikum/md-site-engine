'use strict';

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
    }
  };

  this.create = function ( language, baseUrl, definition ) {

    // Create the context.
    var context = Object.assign( {
      language:language,
      baseUrl: baseUrl,
      metadata: definition,
      menus: filingCabinet.menus.get( language )
    }, proto );

    // Immutable object.
    Object.freeze( context );

    return context;
  }
};

module.exports = ContextFactory;
