'use strict';

/**
 * Inserts static segments into all components.
 * @param {object} components - The components to process.
 * @param {SegmentDrawer} segments - The segment storage.
 * @param {Array.<string>} languages - The list of languages.
 */
function insertStaticSegments( components, segments, languages ) {

  for (var componentName in components) {
    if (components.hasOwnProperty( componentName )) {
      var language;
      var appliedTokens = [ ];
      var component = components[ componentName ];

      // Determine the language of the component.
      if (typeof languages === 'string')
        language = languages;
      else {
        var parts = componentName.split( '/', 2 );
        language = languages.indexOf( parts[ 0 ] ) >= 0 ? parts[ 0 ] : '';
      }

      // Insert static segments into a language specific component only.
      if (language) {
        // Get static segment tokens of the component.
        component.tokens.filter( function ( token ) {
          return token.isStatic;
        } )
          .forEach( function ( token ) {

            // Get segment.
            var segment = segments.get( language, token.name );

            // Insert the static segment into the component.
            var re = new RegExp( token.expression, 'g' );
            component.html = component.html.replace( re, segment.html );
            appliedTokens.push( token.name );
          } );

        // Remove applied segment tokens.
        component.tokens = component.tokens.filter( function ( token ) {
          return appliedTokens.indexOf( token.name ) < 0;
        } );
      }
    }
  }
}

module.exports = insertStaticSegments;
