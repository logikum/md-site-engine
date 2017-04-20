'use strict';

function searchResults( ctx ) {
  var results = ctx.getSearchResults();
  var html = '';

  if (results.length > 0) {
    results.forEach( function ( item ) {

      html += '<div class="search-result">\n';
      html += '  <h4><a href="' + item.path + '">' + item.title + '</a></h4>\n';
      html += '  <div>' + item.description + '</div>\n';
      html += '</div>\n';
    } );
  } else {
    html += '<div class="search-result">\n';
    html += '  <em>' + ctx.t( 'noSearchResult' ) + '</em>\n';
    html += '</div>\n';
  }

  return html;
}

module.exports = searchResults;
