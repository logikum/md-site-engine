'use strict';

var logger = require( '../utilities/logger.js' );
var PATH = require( './../utilities/rd-path.js' );
var sanitize = require( './../utilities/sanitize-html.js' );

var ControlDrawer = function() {

  var controls = { };

  //region Methods

  /**
   * Stores a control.
   * @param {string} key - The path of the control.
   * @param {string} control - The control script.
   */
  this.add = function( key, control ) {

    key = key.replace( /\\/g, '/' );

    // Check existing system control.
    if (controls[ key ] !== undefined)
      logger.showWarning( 'System control "' + key + '" has been overwritten.' );

    // Store the control.
    controls[ key ] = control;
  };

  /**
   * Returns a control.
   * @param {string} key - The path of the control.
   * @returns {string} The requested control script.
   */
  this.get = function( key ) {

    if (controls[ key ] !== undefined)
      // The requested control is found.
      return controls[ key ];

    else {
      // The requested control is not found.
      logger.showError( 'Control "' + key + '" is not found.' );

      // Return a proxy control.
      return function( ctx ) {
        return '';
      };
    }
  };

  //endregion

  //region Validation

  /**
   * Determines whether the specified control exists.
   * @param {string} key - The path of the control.
   * @returns {boolean} True when the control exists; otherwise false.
   */
  this.has = function( key ) {
    // Is the control available?
    return controls[ key ] !== undefined;
  };

  //endregion

  //region Developer methods

  /**
   * Returns the list of the controls.
   * @param {string} itemPath - The base URL of the details page.
   * @returns {string} The list of the controls in HTML format.
   */
  this.list = function( itemPath ) {

    var list = '<ul>\n';
    for (var key in controls) {
      list += '<li><a href="' + itemPath + '/' + PATH.safe( key ) + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  /**
   * Returns the details of a control.
   * @param {string} key - The identifier of the control.
   * @returns {string} The details of the control in HTML format.
   */
  this.show = function( key ) {

    return '<pre><code class="lang-javascript">' +
      sanitize( controls[ key ].toString() ) +
      '</code></pre>\n';
  };

  //endregion
};

module.exports = ControlDrawer;
