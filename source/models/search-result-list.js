'use strict';

var util = require('util');

/**
 * Represents a search result collection.
 * @param {function} translate - The text localizer function.
 * @constructor
 */
var SearchResultList = function( translate ) {

  Array.call( this );

  /**
   * Gets the localized text of the key in the current language.
   * It is the same as ContextProto.translate().
   * @param {string} key - The key of the requested locale.
   * @returns {string} The localized text.
   */
  this.t = translate;

  /**
   * Gets the text to search.
   * @type {string|null}
   */
  this.text2search = null;
};

util.inherits(SearchResultList, Array);

/**
 * Returns search results in HTML format.
 * @returns {string} The HTML string.
 */
SearchResultList.prototype.toString = function() {
  var html = '';

  if (this.text2search === null) {
    html += '<div class="search-result">\n';
    html += '  <em>' + this.t( 'noSearchPhrase' ) + '</em>\n';
    html += '</div>\n';
  }
  else if (this.length > 0) {
    this.forEach( function ( item ) {

      html += '<div class="search-result">\n';
      html += '  <h4><a href="' + item.path + '">' + item.title + '</a></h4>\n';
      html += '  <div>' + item.description + '</div>\n';
      html += '</div>\n';
    } );
  } else {
    html += '<div class="search-result">\n';
    html += '  <em>' + this.t( 'noSearchResult' ) + '</em>\n';
    html += '</div>\n';
  }

  return html;
};

module.exports = SearchResultList;
