'use strict';

var Context = require( './context.js' );
var ContextProto = require( './context-proto.js' );

/**
 * Utility to create context objects for controls.
 * @param {Configuration} config - The configuration object.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @constructor
 */
var ContextFactory = function( config, filingCabinet ) {

  // Create the fixed part of the contexts.
  var proto = new ContextProto( config, filingCabinet );

    /**
   * Creates a context object for controls.
   * @param {string} language - The current language.
   * @param {string} url - The request URL string.
   * @param {Metadata} definition - The metadata of the current path.
   */
  this.create = function ( language, url, definition ) {

    // Create the context.
    var context = new Context( proto, filingCabinet, language, url, definition );

      // Immutable object.
    Object.freeze( context );

    return context;
  }
};

module.exports = ContextFactory;
