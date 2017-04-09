'use strict';

var highlight = require( 'highlight.js' );

function markedRenderer( marked ) {

  // Synchronous highlighting with highlight.js
  marked.setOptions( {
    highlight: function ( code ) {
      return highlight.highlightAuto( code, [ 'javascript' ] ).value;
    }
  } );

  return  new marked.Renderer();
}

module.exports = markedRenderer;
