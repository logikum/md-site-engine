'use strict';

var insertStaticSegments = require( './insert-static-segments.js' );
var logger = require( '../utilities/logger.js' );
var PATH = require( './../utilities/rd-path.js' );
var showComponent = require( './../utilities/show-component.js' );

var DocumentDrawer = function() {

  var documents = { };

  //region Methods

  /**
   * Stores a document.
   * @param {string} key - The identifier of the document.
   * @param {Component} document - The document object.
   */
  this.add = function( key, document) {

    // Store the document.
    documents[ key ] = document;
  };

  /**
   * Returns a document.
   * @param {string} language - The language of the document.
   * @param {string} key - The path of the document.
   * @returns {Component} The requested document object.
   */
  this.get = function( language, key ) {

    // Try language specific document.
    var langKey = [ language, key ].join( '/' );
    if (documents[ langKey ] !== undefined)
      // The requested language document is found.
      return documents[ langKey ];

    // Try neutral document.
    if (documents[ key ] !== undefined)
      // The requested neutral document is found.
      return documents[ key ];

    // The request cannot be fulfilled.
    throw new Error( 'Document ' + key + ' is not found.' );
  };

  //endregion

  //region Validation

  /**
   * Makes final steps on the documents:
   *    * Validate tokens.
   *    * Insert static segments into contents.
   * @param {SegmentDrawer} segments - The segment storage.
   * @param {ControlDrawer} controls - The control storage.
   * @param {Array.<string>} languages - The list of languages.
   * @param {string} layoutSegment - The name of the layout segment.
   */
  this.finalize = function( segments, controls, languages, layoutSegment ) {

    // Validate tokens.
    for(var path in documents) {
      // Determine language.
      var language = '';
      var pos = path.indexOf( '/' );
      if (pos > 0 && languages.indexOf( path.substring( 0, pos ) ) > -1) {
        language = path.substring( 0, pos );
      }
      // Try to access segments.
      var document = documents[ path ];
      document.tokens.forEach( function( token ) {
        if (token.isControl) {
          // Check the control.
          if (!controls.has( token.name ))
            logger.showWarning( 'Token "' + token.name + '" in document "' + path +
              '" has no matching control - must be specified in metadata.' );
        } else {
          if (token.name !== layoutSegment) {
            if (language === '') {
              // Check the segments in all languages.
              var allHave = languages.every( function( lang ) {
                return segments.has( lang, token.name );
              });
              if (!allHave)
                logger.showWarning( 'Token "' + token.name + '" in document "' + path +
                  '" has no matching default segment - must be specified in metadata.' );
            } else if (!token.isData) {
              // Check the segment.
              if (!segments.has( language, token.name ))
                logger.showWarning( 'Token "' + token.name + '" in document "' + path +
                  '" has no matching segment - must be specified in metadata.' );
            }
          }
        }
      } )
    }

    // Insert static segments into language specific documents.
    insertStaticSegments( documents, segments, languages );
  };

  //endregion

  //region Developer methods

  /**
   * Returns the list of the documents.
   * @param {string} itemPath - The base URL of the details page.
   * @returns {string} The list of the documents in HTML format.
   */
  this.list = function( itemPath ) {
    var list = '<ul>\n';

    for (var key in documents) {
      list += '<li><a href="' + itemPath + '/' + PATH.safe( key ) + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  /**
   * Returns the details of a document.
   * @param {string} key - The identifier of the document.
   * @returns {string} The details of the document in HTML format.
   */
  this.show = function( key ) {

    return showComponent( documents[ key ] );
  };

  //endregion
};

module.exports = DocumentDrawer;
