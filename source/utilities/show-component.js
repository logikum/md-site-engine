'use strict';

var sanitize = require( './sanitize-html.js' );

/**
 * Returns the list of the properties of a component to display.
 * @param {Component} component - The component object to display.
 * @returns {string} The list of component properties in HTML format.
 */
var showComponent = function( component ) {

  var list = '<ul>\n';
  for (var item in component) {
    if (item === 'html')
      list += '<li><b>' + item + '</b>:<pre><code class="lang-html">' +
        sanitize( component[ item ] ) +
        '</code></pre></li>\n';

    else if (item === 'tokens') {
      list += '<li><b>' + item + '</b>:</li>\n';
      var tokens = component[ item ];

      list += '<ul>\n';
      for (var tokenId in tokens) {
        var token = tokens[ tokenId ];
        list += '<li><strong>' + token.name + '</strong>:</li>\n';

        list += '<ul>\n';
        for (var attr in token) {
          list += '<li><data>' + attr + '</data>: ' + token[ attr ] + '</li>\n';
        }
        list += '</ul>\n';
      }
      list += '</ul>\n';
    }
    else
      list += '<li><b>' + item + '</b>: ' + component[ item ] + '</li>\n';
  }
  return list + '</ul>\n';
};

module.exports = showComponent;
