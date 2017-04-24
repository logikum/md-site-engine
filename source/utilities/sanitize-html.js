'use strict';

/**
 * Returns a HTML encoded text to display in a web page.
 * @param {string} html - The HTML text to encode.
 * @returns {string} The encoded text to display in a web page.
 */
function sanitize( html ) {
  return html.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' );
}

module.exports = sanitize;
