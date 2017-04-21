'use strict';

function negotiateLanguage( acceptable, supported, engineDefault ) {
  var candidates = [];
  var enumeration = acceptable || '';
  var start = 0;

  if (enumeration) {
    // Create list of candidate locales.
    var re = /;q=[01]\.\d,?/g;
    var matches = enumeration.match( re );
    if (matches)
    // Create weighted list of locales.
      for (var i = 0; i < matches.length; i++) {
        var q = matches[ i ];
        var index = enumeration.indexOf( q );
        var group = enumeration.substring( 0, index );
        var members = group.split( ',' );
        var value = +q.substr( 3, 3 );
        members.forEach( function ( member ) {
          candidates.push( { locale: member, weight: value } );
        } );
        enumeration = enumeration.substring( index + q.length );
      }
    else {
      // Create simple list of locales.
      var locales = enumeration.split( ',' );
      locales.forEach( function ( member ) {
        candidates.push( { locale: member, weight: 1.0 } );
      } );
    }
  }

  // Sort locales by weight DESC, locale length DESC.
  candidates.sort( function ( a, b ) {
    if (a.weight < b.weight)
      return 1;
    if (a.weight > b.weight)
      return -1;
    if (a.locale.length < b.locale.length)
      return 1;
    if (a.locale.length > b.locale.length)
      return -1;
    return 0;
  } );

  // Find candidates among supported locales.
  for (var c = 0; c < candidates.length; c++) {
    var item = candidates[ c ].locale;
    do {
      if (supported.indexOf( item ) > -1)
        return item;
      // Try without country/region code.
      item = item.substring( 0, item.lastIndexOf( '-' ) );
    }
    while (item);
  }
  // No supported candidate: return engine's default locale.
  return engineDefault;
}

module.exports = negotiateLanguage;
