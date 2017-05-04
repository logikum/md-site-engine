'use strict';

/**
 * Escapes the special regular expression characters in a text.
 * @param {string} html - The text to escape.
 * @returns {string} The escaped text to use in regular expression.
 */
function escapeRegExp( text ) {
  return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = escapeRegExp;
