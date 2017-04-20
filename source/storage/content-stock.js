'use strict';

var insertStaticSegments = require( './insert-static-segments.js' );
var PATH = require( './../utilities/rd-path.js' );
var Content = require( './../models/content.js' );
var Metadata = require( './../models/metadata.js' );
var SearchResult = require( './../models/search-result.js' );
var showComponent = require( './../utilities/show-component.js' );
var showMetadata = require( './../utilities/show-metadata.js' );

var ContentStock = function() {

  var self = this;
  var contents = [ ];
  var definitions = [ ];
  var map = { };
  var index404;
  var hasSearch = false;

  this.add = function( content, definition ) {
    if (arguments.length > 1) {
      // Delete path - saved on metadata.
      var path = content.path;
      //delete content.path;

      // Store content.
      contents.push( content );

      // Store definition.
      definitions.push( definition );

      // Create default map.
      var index = contents.length - 1;
      addMap( path, index );

      // Add optional alternate maps.
      var length = path.length;
      if (length >= 6 && path.substr( -6 ) === '/index') {
        addMap( path.substr( 0, length - 5 ), index );
        addMap( path.substr( 0, length - 6 ), index );
      }
    }
  };

  function addMap( path, index ) {

    // Store the index.
    map[ path ] = index;

    // Find custom error content.
    if (path === '/404')
      index404 = index;

    // Find search result page.
    if (path === '/search')
      hasSearch = true;
  }

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

  this.getDefinition = function( path ) {

    if (map[ path ] !== undefined)
    // The requested definition is found.
      return definitions[ map[ path ] ];

    else
    // The requested definition is not found - empty definition.
      return new Metadata( { }, '' );
  };

  //region Search

  this.hasSearch = function() {

    // Does search result page exist?
    return hasSearch;
  };

  this.search = function( text2search ) {
    var results = [ ];

    definitions
      .filter( function( definition ) {
        return definition.searchable;
      })
      .forEach( function( definition ) {
        var priority = 0;
        if (definition.title && definition.title.indexOf( text2search ) >= 0)
          priority = 4;
        else if (definition.keywords && definition.keywords.indexOf( text2search ) >= 0)
          priority = 3;
        else if (definition.description && definition.description.indexOf( text2search ) >= 0)
          priority = 2;
        else {
          var content = self.getContent( definition.path );
          if (content instanceof Content && content.searchable &&
            content.searchable.indexOf( text2search ) >= 0)
            priority = 1;
        }

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

  this.findDefinition = function ( id ) {

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

  this.finalize = function ( language, segments, controls ) {

    // Validate tokens.
    for(var path in contents) {
      // Try to access segments.
      var content = contents[ path ];
      content.tokens.forEach( function( token ) {
        if (token.isControl) {
          // Check the control.
          if (!controls.has( token.name ))
            logger.showWarning( 'Token "' + token.name + '" in content "' + path +
              '" has no matching control - must be specified in metadata.' );
        } else {
          // Check the segment.
          if (!segments.has( language, token.name ))
            logger.showWarning( 'Token "' + token.name + '" in content "' + path +
              '" has no matching segment - must be specified in metadata.' );
        }
      } )
    }

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
          content.searchable = content.text
            .replace( /<(?:.|\n)*?>/gm, " " )   // remove HTML tags
            .replace( /\W/g, ' ' )   // remove non alphanumeric characters
            .replace( /\s+/g, ' ' )   // remove multiple spaces
            .toLowerCase();
      } );
  };

  //endregion

  //region Developer methods

  this.list = function ( language, itemPath ) {
    var list = '<ul>\n';
    for (var key in map) {
      var itemUrl = itemPath + '/' + language + '/' + PATH.safe( key );
      list += '<li><a href="' + itemUrl + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  this.show = function ( itemPath ) {

    var list = showComponent( contents[ map[ itemPath ] ] );
    list += showMetadata( definitions[ map[ itemPath ] ] );
    return list;
  };

  //endregion
};

module.exports = ContentStock;
