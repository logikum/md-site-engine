'use strict';

var logger = require( '../utilities/logger.js' );
var PATH = require( './../utilities/rd-path.js' );
var sanitize = require( './../utilities/sanitize-html.js' );

var ControlDrawer = function() {

  var controls = { };

  this.add = function ( key, control ) {

    key = key.replace( /\\/g, '/' );

    // Check existing system control.
    if (controls[ key ] !== undefined)
      logger.showWarning( 'System control "' + key + '" has been overwritten.' );

    // Store the control.
    controls[ key ] = control;
  };

  this.get = function ( key ) {

    if (controls[ key ] !== undefined)
      // The requested control is found.
      return controls[ key ];

    else {
      // The requested control is not found.
      logger.showError( 'Control "' + key + '" is not found.' );

      // Return a proxy control.
      return function (ctx) {
        return '';
      };
    }
  };

  this.has = function ( key ) {
    // Is the control available?
    return controls[ key ] !== undefined;
  };

  //region Developer methods

  this.list = function ( itemPath ) {
    var list = '<ul>\n';
    for (var key in controls) {
      list += '<li><a href="' + itemPath + '/' + PATH.safe( key ) + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  this.show = function ( key ) {
    return '<pre><code class="lang-javascript">' +
      sanitize( controls[ key ].toString() ) +
      '</code></pre>\n';
  };

  //endregion
};

module.exports = ControlDrawer;
