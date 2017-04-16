'use strict';

var fs = require( 'fs' );
var path = require( 'path' );

function getReference( referenceFile ) {
  var text = '';

  // Read references file.
  var referencePath = path.join( process.cwd(), referenceFile );

  var stats = fs.statSync( referencePath );
  if (stats && stats.isFile()) {
    text = fs.readFileSync( referencePath, { encoding: 'utf8' } );

    // Find common root definitions (tilde references).
    var tildes = { };
    var re = /^\s*\[(~\d?)]\s*:/g;
    var lines = text.split( '\n' );
    for (var i = 0; i < lines.length; i++) {
      var line = lines[ i ].trim();
      // Search common root pattern.
      var result = re.exec( line );
      if (result) {
        // Save common root value.
        tildes[ result[ 1 ] ] = line.substring( line.indexOf( ':' ) + 1 ).trim();
        // Remove this line from references.
        lines.splice( i, 1 );
      }
    }
    text = lines.join( '\n' );

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

    text = '\n\n' + text;
  }
  return text;
}

module.exports = getReference;
