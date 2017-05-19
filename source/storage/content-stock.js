'use strict';

var insertStaticSegments = require( './insert-static-segments.js' );
var logger = require( './../utilities/logger.js' );
var PATH = require( './../utilities/rd-path.js' );
var Content = require( './../models/content.js' );
var Metadata = require( './../models/metadata.js' );
var SearchResult = require( './../models/search-result.js' );
var escapeRegExp = require( './../utilities/escape-reg-exp.js' );
var showComponent = require( './../utilities/show-component.js' );
var showMetadata = require( './../utilities/show-metadata.js' );

/**
 * Represents a content store of one language.
 * @param {string} path404 - The path of the content not found page.
 * @param {string} pathSearch - The path of the search page.
 * @constructor
 */
var ContentStock = function( path404, pathSearch ) {

  var self = this;
  var contents = [ ];
  var definitions = [ ];
  var map = { };
  var index404;
  var searchPath = '';

  //region Methods

  /**
   * Stores a content with its metadata.
   * @param {Content} content - The content object.
   * @param {Metadata} definition - The metadata object.
   */
  this.add = function( content, definition ) {
    if (arguments.length > 1) {
      // Delete path - saved on metadata.
      var path = content.path;
      delete content.path;

      // Store content.
      contents.push( content );

      // Store definition.
      definitions.push( definition );

      // Create default map.
      var index = contents.length - 1;
      addMap( path, definition.id, index );

      // Add optional alternate maps.
      var length = path.length;
      if (length >= 6 && path.substr( -6 ) === '/index') {
        addMap( path.substr( 0, length - 5 ), definition.id, index );
        addMap( path.substr( 0, length - 6 ), definition.id, index );
      }
    }
  };

  function addMap( path, id, index ) {

    // Store the index.
    map[ path ] = index;

    // Find custom error content.
    if (id === path404)
      index404 = index;

    // Find search result page.
    if (id === pathSearch)
      searchPath = path;
  }

  /**
   * Returns the content of the requested path.
   * @param {string} path - The path of the content.
   * @returns {Content} The requested content object.
   */
  this.getContent = function( path ) {

    if (map[ path ] !== undefined)
    // The requested content is found.
      return contents[ map[ path ] ];

    else if (index404 !== undefined)
    // The requested content is not found - custom error.
      return contents[ index404 ];

    else
    // The requested content is not found - no content.
      return '<p><b>404</b> - That\'s an error.</p><p>The requested URL ' +
        path + ' was not found on this server.</br>That’s all we know.</p>';
  };

  /**
   * Returns the metadata of the content of the requested path.
   * @param {string} path - The path of the content.
   * @returns {Metadata} The requested metadata object.
   */
  this.getDefinition = function( path ) {

    if (map[ path ] !== undefined)
    // The requested definition is found.
      return definitions[ map[ path ] ];

    else
    // The requested definition is not found - empty definition.
      return new Metadata( { }, '' );
  };

  /**
   * Gets the path of the context having the passed identifier.
   * @param {string} id - The identifier of the content.
   */
  this.getPathById = function( id ) {

    for (var i = 0; i < definitions.length; i++ ) {
      var definition = definitions[ i ];
      if (definition.id === id)
        return definition.path;
    }
    return '/';
  };

  //endregion

  //region Search

  /**
   * Returns the path of the search page.
   * @returns {string} The path of the search page.
   */
  this.searchPath = function() {

    // Does search result page exist?
    return searchPath;
  };

  /**
   * Return the list of the contents matching the search phrase.
   * @param {SearchResultList} results - The container for the search results.
   * @returns {SearchResultList} The list of matching contents.
   */
  this.search = function( results ) {

    // Check all searchable contents.
    definitions
      .filter( function( definition ) {
        return definition.searchable;
      })
      .forEach( function( definition ) {
        var priority = 0;
        var re = new RegExp( escapeRegExp( results.text2search ), 'i' );

        // Try to find the search phrase somewhere...
        if (definition.title && re.test( definition.title ))
          priority = 4;
        else if (definition.keywords && re.test( definition.keywords ))
          priority = 3;
        else if (definition.description && re.test( definition.description ))
          priority = 2;
        else {
          var content = self.getContent( definition.path );
          if (content instanceof Content && content.text && re.test( content.text ))
            priority = 1;
        }
        // Does the search phrase appear in this content?
        if (priority > 0)
          results.push( new SearchResult( definition, priority ) );
      } );

    // Get search results ordered by priority DESC, title ASC.
    return results.sort( function ( a, b ) {
      if (a.priority < b.priority)
        return 1;
      if (a.priority > b.priority)
        return -1;
      // priorities are equal
      if (a.title < b.title)
        return -1;
      if (a.title > b.title)
        return 1;
      // a must be equal to b
      return 0;
    });
  };

  //endregion

  //region Validation

  /**
   * Returns the metadata of a content.
   * @param {string} id - The identifier of the content.
   * @returns {Metadata} The requested metadata.
   */
  this.findDefinition = function( id ) {

    var targets = definitions.filter( function( definition ) {
      return definition.id === id;
    });

    if (targets.length > 0)
    // The requested definition is found.
      return targets[ 0 ];

    else
    // The requested definition is not found - empty definition.
      return new Metadata( { }, '' );
  };

  /**
   * Makes final steps on the contents:
   *    * Validate tokens.
   *    * Insert static segments into contents.
   *    * Create searchable texts.
   * @param {string} language - The language of the contents.
   * @param {SegmentDrawer} segments - The segment storage.
   * @param {ControlDrawer} controls - The control storage.
   */
  this.finalize = function( language, segments, controls ) {

    // Validate tokens.
    contents.forEach( function( content ) {
      // Try to access segments.
      content.tokens.forEach( function( token ) {
        if (token.isControl) {
          // Check the control.
          if (!controls.has( token.name ))
            logger.showWarning( 'Token "' + token.name +
              '" in content "' + content.path +
              '" has no matching control - must be specified in metadata.' );
        } else if (!token.isData) {
          // Check the segment.
          if (!segments.has( language, token.name ))
            logger.showWarning( 'Token "' + token.name +
              '" in content "' + content.path +
              '" has no matching segment - must be specified in metadata.' );
        }
      } )
    } );

    // Insert static segments into language specific contents.
    insertStaticSegments( contents, segments, language );

    // Create searchable texts.
    definitions
      .filter( function( definition ) {
        return definition.searchable;
      })
      .forEach( function( definition ) {
        var content = self.getContent( definition.path );
        if (content instanceof Content)
          content.text = content.html
            .replace( /<(?:.|\n)*?>/gm, " " )   // remove HTML tags
            .replace( /\W/g, ' ' )   // remove non alphanumeric characters
            .replace( /\s+/g, ' ' )   // remove multiple spaces
            .toLowerCase();
      } );
  };

  //endregion

  //region Developer methods

  /**
   * Returns the list of the contents.
   * @param {string} language - The language of the contents.
   * @param {string} itemPath - The base URL of the details page.
   * @returns {string} The list of the contents in HTML format.
   */
  this.list = function( language, itemPath ) {
    var list = '<ul>\n';

    Object.getOwnPropertyNames( map )
      .sort()
      .forEach( function( key ) {
        if (!(
          key.length > 5 && key.substr( -6 ) === '/index' ||
          key[ key.length - 1 ] === '/'
          ))
        {
          var itemUrl = itemPath + '/' + language + '/' + PATH.safe( key ? key : '/index' );
          list += '<li><a href="' + itemUrl + '">' + (key ? key : '(root)') + '</a></li>\n';
        }
      } );
    return list + '</ul>\n';
  };

  /**
   * Returns the details of a content.
   * @param {string} itemPath - The path of the content.
   * @returns {string} The details of the content in HTML format.
   */
  this.show = function( itemPath ) {

    var list = showComponent( contents[ map[ itemPath ] ] );
    list += showMetadata( definitions[ map[ itemPath ] ] );
    return list;
  };

  //endregion
};

//endregion

module.exports = ContentStock;
