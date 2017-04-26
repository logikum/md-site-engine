'use strict';

var fs = require( 'fs' );
var path = require( 'path' );

/**
 * Reads the content of a reference file.
 * @param {string} referenceFile - The path of the reference file.
 * @returns {string} The list of reference links.
 */
function getReference( referenceFile ) {
  var text = '';

  // Read references file.
  var referencePath = path.join( process.cwd(), referenceFile );

  var stats = fs.statSync( referencePath );
  if (stats && stats.isFile()) {
    text = fs.readFileSync( referencePath, { encoding: 'utf8' } );

    // Find common root definitions (tilde references).
    var tildes = { };
    var re = /^\s*\[(~\d*)]\s*:/g;
    var source = text.split( '\n' );
    var target = [ ];
    for (var i = 0; i < source.length; i++) {
      var line = source[ i ].trim();
      // Search common root pattern.
      var result = re.exec( line );
      if (result)
      // Save common root value.
        tildes[ result[ 1 ] ] = line.substring( line.indexOf( ':' ) + 1 ).trim();
      else if (line[ 0 ] === '[')
      // Store reference link.
        target.push( line );
    }
    text = target.join( '\n' );

    // Replace tilde+number pairs with common roots.
    var noIndex = false;
    for (var attr in tildes) {
      if (tildes.hasOwnProperty( attr )) {
        if (attr === '~')
          noIndex = true;
        else {
          var re_n = new RegExp( ' ' + attr, 'g' );
          var re_value = ' ' + tildes[ attr ];
          text = text.replace( re_n, re_value );
        }
      }
    }
    // Finally replace tildes with its common root.
    if (noIndex)
      text = text.replace( / ~/g, ' ' + tildes[ '~' ] );
  }
  return text;
}

module.exports = getReference;
