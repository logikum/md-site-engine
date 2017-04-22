'use strict';

var insertStaticSegments = require( './insert-static-segments.js' );
var logger = require( '../utilities/logger.js' );
var PATH = require( './../utilities/rd-path.js' );
var showComponent = require( './../utilities/show-component.js' );

var LayoutDrawer = function() {

  var layouts = { };

  //region Methods

  this.add = function ( key, layout ) {

    // Store the layout.
    layouts[ key ] = layout;
  };

  this.get = function ( language, key ) {

    // Try language specific layout.
    var langKey = [ language, key ].join( '/' );
    if (layouts[ langKey ] !== undefined)
    // The requested language layout is found.
      return layouts[ langKey ];

    // Try neutral layout.
    if (layouts[ key ] !== undefined)
    // The requested neutral layout is found.
      return layouts[ key ];

    // The request cannot be fulfilled.
    throw new Error( 'Layout ' + key + ' is not found.' );
  };

  //endregion

  //region Validation

  this.finalize = function ( segments, controls, languages, contentSegment ) {

    // Validate tokens.
    for(var path in layouts) {
      // Determine language.
      var language = '';
      var pos = path.indexOf( '/' );
      if (pos > 0 && languages.indexOf( path.substring( 0, pos ) ) > -1) {
        language = path.substring( 0, pos );
      }
      // Try to access segments.
      var layout = layouts[ path ];
      layout.tokens.forEach( function( token ) {
        if (token.isControl) {
          // Check the control.
          if (!controls.has( token.name ))
            logger.showWarning( 'Token "' + token.name + '" in layout "' + path +
              '" has no matching control - must be specified in metadata.' );
        } else {
          if (token.name !== contentSegment) {
            if (language === '') {
              // Check the segments in all languages.
              var allHave = languages.every( function( lang ) {
                return segments.has( lang, token.name );
              });
              if (!allHave)
                logger.showWarning( 'Token "' + token.name + '" in layout "' + path +
                  '" has no matching default segment - must be specified in metadata.' );
            } else {
              // Check the segment.
              if (!segments.has( language, token.name ))
                logger.showWarning( 'Token "' + token.name + '" in layout "' + path +
                  '" has no matching segment - must be specified in metadata.' );
            }
          }
        }
      } )
    }

    // Insert static segments into language specific layouts.
    insertStaticSegments( layouts, segments, languages );
  };

  //endregion

  //region Developer methods

  this.list = function ( itemPath ) {
    var list = '<ul>\n';
    for (var key in layouts) {
      list += '<li><a href="' + itemPath + '/' + PATH.safe( key ) + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  this.show = function ( key ) {
    return showComponent( layouts[ key ] );
  };

  //endregion
};

module.exports = LayoutDrawer;
