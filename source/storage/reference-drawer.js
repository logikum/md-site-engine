'use strict';

var path = require( 'path' );
var PATH = require( './../utilities/rd-path.js' );

var ReferenceDrawer = function( referenceFile ) {

  var references = { };
  var key = path.basename( referenceFile, path.extname( referenceFile ));

  //region Methods

  /**
   * Stores a reference.
   * @param {string} key - The path of the reference.
   * @param {string} reference - The reference list.
   */
  this.add = function( key, reference ) {

    // Store the reference list.
    references[ key ] = reference;
  };

  /**
   * Returns a compound reference.
   * @param {string} language - The language of the reference.
   * @returns {string} The requested reference list.
   */
  this.get = function( language ) {

    // Get the neutral references.
    var result = '\n' + (references[ key ] || '');

    // Get the language specific references.
    result += '\n' + (references[ [ language, key ].join( '/' ) ] || '');

    // Return the joined references.
    return result;
  };

  //endregion

  //region Developer methods

  /**
   * Returns the list of the references.
   * @param {string} itemPath - The base URL of the details page.
   * @returns {string} The list of the references in HTML format.
   */
  this.list = function( itemPath ) {
    var list = '<ul>\n';

    for (var key in references) {
      list += '<li><a href="' + itemPath + '/' + PATH.safe( key ) + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  /**
   * Returns the details of a reference.
   * @param {string} key - The path of the reference.
   * @returns {string} The details of the reference in HTML format.
   */
  this.show = function( key ) {

    return '<pre><code class="no-highlight">' + references[ key ] + '</code></pre>\n';
  };

  //endregion
};

module.exports = ReferenceDrawer;
