'use strict';

function searchResults( ctx ) {
  var html = '';
  var results = ctx.getSearchResults();

  results.forEach( function( item ) {

    html += '<div class="search-result">\n';
    html += '  <h4><a href="' + item.path + '">' + item.title + '</a></h4>\n';
    html += '  <div>' + item.description + '</div>\n';
    html += '</div>\n';
  })
  return html;
}

module.exports = searchResults;
