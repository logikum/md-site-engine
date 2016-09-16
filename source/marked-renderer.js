'use strict';

var highlight = require( 'highlight.js' );

function markedRenderer( marked ) {

  // Synchronous highlighting with highlight.js
  marked.setOptions( {
    highlight: function ( code ) {
      return highlight.highlightAuto( code, [ 'javascript' ] ).value;
    }
  } );

  var renderer = new marked.Renderer();

  renderer.table = function ( header, body ) {
    var match = /%(\w+\d?)%/.exec( header );
    if (match === null) {
      header = header.replace( /<\/th>\n<th>/g, '</th>\n<th class="text-center">' );
      body = body.replace( /<\/td>\n<td>/g, '</td>\n<td class="text-center">' );
      return '<table class="table table-condensed">\n' +
        '  <thead>\n' +
        header + '\n' +
        '  </thead>\n' +
        '  <tbody>\n' +
        body + '\n' +
        '  </tbody>\n' +
        '</table>\n';
    } else
      switch (match[ 1 ]) {
        case 'args':
          body = body
            .replace( /<tr>\n<td>/g, '<tr>\n<td class="arg-name"><code>' )
            .replace( /<\/td>\n<td>/g, '</code></td>\n<td class="arg-desc">' );
          return '<div class="arguments">\n' +
            '  <table class="table table-condensed">\n' +
            '    <tbody>\n' +
            body + '\n' +
            '    </tbody>\n' +
            '  </table>\n' +
            '</div>\n';
        case 'indent1':
        case 'indent2':
        case 'indent3':
        case 'indent4':
          header = header.replace( match[ 0 ], '' );
          return '<div class="row">' +
            //    '  <div class="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">\n' +
            '  <div class="' + getDivClass( match[ 1 ] ) + '">\n' +
            '    <table class="table table-condensed">\n' +
            '      <thead>\n' +
            header + '\n' +
            '      </thead>\n' +
            '      <tbody>\n' +
            body + '\n' +
            '      </tbody>\n' +
            '    </table>\n' +
            '  </div>\n' +
            '</div>\n';
        default:
          return '<p class="bg-danger">' + match[ 0 ] + '</p>';
      }
  };
  function getDivClass( name ) {
    var offset = parseInt( name.substr( 6 ) );
    var width = 12 - 2 * offset;
    return 'col-sm-' + width + ' col-sm-offset-' + offset +
      ' col-md-' + width + ' col-md-offset-' + offset +
      ' col-lg-' + width + ' col-lg-offset-' + offset;
  }

  renderer.link = function ( href, title, text ) {
    if (href.substr( 0, 7 ) === 'http://')
      return '<a href="' + href + '" title="' + title + '" class="bo-api">' + text + '</a>';
    else
      return '<a href="' + href + '" title="' + title + '">' + text + '</a>';
  };

  return renderer;
}

module.exports = markedRenderer;
