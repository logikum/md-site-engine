'use strict';

function sanitize( html ) {
  return html.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' );
}

module.exports = sanitize;
