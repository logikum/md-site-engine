'use strict';

var util = require('util');

/**
 * Represents a search result collection.
 * @param {string} text2search - The text to search.
 * @param {string} noSearchPhrase - The message when search phrase is missing.
 * @param {string} noSearchResult - The message when search has no result.
 * @constructor
 */
var SearchResultList = function( text2search, noSearchPhrase, noSearchResult ) {

  Array.call( this );

  /**
   * Gets the text to search.
   * @type {string|null}
   */
  this.text2search = text2search || null;

  /**
   * Gets a message to display when search phrase is missing.
   * @type {string}
   */
  this.noSearchPhrase = noSearchPhrase;

  /**
   * Gets a message to display when search did not found the text in the contents.
   * @type {string}
   */
  this.noSearchResult = noSearchResult;
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
    html += '  <em>' + this.noSearchPhrase + '</em>\n';
    html += '</div>\n';
  }
  else if (this.length > 0) {
    var hlText = this.text2search;

    this.forEach( function ( item ) {

      html += '<div class="search-result">\n';
      html += '  <h4><a href="' + item.path + '?hl=' + hlText + '">' + item.title + '</a></h4>\n';
      html += '  <div>' + item.description + '</div>\n';
      html += '</div>\n';
    } );
  } else {
    html += '<div class="search-result">\n';
    html += '  <em>' + this.noSearchResult + '</em>\n';
    html += '</div>\n';
  }

  return html;
};

module.exports = SearchResultList;
