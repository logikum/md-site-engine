'use strict';

var path = require( 'path' );
var PATH = require( './../utilities/rd-path.js' );

var ReferenceDrawer = function( referenceFile ) {

  var references = { };
  var key = path.basename( referenceFile, path.extname( referenceFile ));

  this.add = function ( key, reference ) {

    // Store the reference list.
    references[ key ] = reference;
  };

  this.get = function ( language ) {

    // Get the neutral references.
    var result = '\n' + (references[ key ] || '');

    // Get the language specific references.
    result += '\n' + (references[ [ language, key ].join( '/' ) ] || '');

    // Return the joined references.
    return result;
  };

  //region Developer methods

  this.list = function ( itemPath ) {
    var list = '<ul>\n';
    for (var key in references) {
      list += '<li><a href="' + itemPath + '/' + PATH.safe( key ) + '">' + key + '</a></li>\n';
    }
    return list + '</ul>\n';
  };

  this.show = function ( key ) {
    return '<pre>' + references[ key ] + '</pre>\n';
  };

  //endregion
};

module.exports = ReferenceDrawer;
