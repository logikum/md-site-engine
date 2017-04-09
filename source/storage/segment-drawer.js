'use strict';

var Component = require( './../models/component.js' );
var logger = require( '../utilities/logger.js' );
var PATH = require( './../utilities/rd-path.js' );
var insertStaticSegments = require( './insert-static-segments.js' );
var showComponent = require( './../utilities/show-component.js' );

var SegmentDrawer = function() {

  var self = this;
  var segments = { };

  this.add = function ( key, segment) {

    // Check existing segment - md + html.
    if (segments[ key ] !== undefined)
      throw new Error( 'Segment ' + key + ' is duplicated.' );

    // Store the segment.
    segments[ key ] = segment;
  };

  this.get = function ( language, key ) {

    // Try language specific segment.
    var langKey = [ language, key ].join( '/' );
    if (segments[ langKey ] !== undefined)
      // The requested language segment is found.
      return segments[ langKey ];

    // Try neutral segment.
    if (segments[ key ] !== undefined)
      // A neutral segment is found.
      return segments[ key ];

    // The requested segment is not found.
    logger.showError( 'Segment "' + key + '" is not found.' );

    // Return a proxy segment.
    return new Component( '', [ ], false, false, false );
  };

  //region Validation

  this.has = function ( language, key ) {

    // Try language specific segment.
    var langKey = [ language, key ].join( '/' );
    if (segments[ langKey ] !== undefined)
      // The requested language segment is found.
      return true;

    // Try neutral segment.
    if (segments[ key ] !== undefined)
      // A neutral segment is found.
      return true;

    // The requested segment is not found.
    return false;
  };

  this.finalize = function ( controls, languages ) {

    // Check reference circles.
    for (var path in segments) {
      var language = '';
      var key = path;
      var pos = path.indexOf( '/' );
      if (pos > 0 && languages.indexOf( path.substring( 0, pos ) ) > -1) {
        language = path.substring( 0, pos );
        key = path.substring( pos + 1 );
      }
      var segment = segments[ path ];
      var chain = [ key ];
      checkReferenceCircle( language, key, segment, chain );

      // Validate control tokens.
      segment.tokens.filter( function( token ) {
        return token.isControl;
      }).forEach( function( token ) {
        // Check the control.
        if (!controls.has( token.name ))
          logger.showWarning( 'Token "' + token.name + '" in segment "' + path +
            '" has no matching control - must be specified in metadata.' );
      } )
    }

    // Insert static segments into segments.
    insertStaticSegments( segments, self, languages );
  };

  function checkReferenceCircle( language, key, segment, chain ) {

    segment.tokens.forEach( function( token ) {
      if (token.isControl)
        return;

      var item = token.name;
      if (chain.indexOf( item ) > -1)
        // Reference circle found.
        logger.showError( 'Token "' + item + '" in segment "' + key + '" makes a reference circle.' );

      else {
        // Get child segment.
        var childSegment = self.get( language, item );
        if (childSegment.tokens.length > 0) {
          // Check child segment.
          var childChain = chain.slice();
          childChain.push( item );
          checkReferenceCircle( language, item, childSegment, childChain );
        }
      }
    });
  }

  //endregion

  //region Developer methods

  this.list = function ( itemPath ) {
    var list = '<ul>\n';
    for (var key in segments) {
      list += '<li><a href="' + itemPath + '/' + PATH.safe( key ) + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  this.show = function ( key ) {
    return showComponent( segments[ key ] );
  };

  //endregion
};

module.exports = SegmentDrawer;
