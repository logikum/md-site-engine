'use strict';

function getTitle( ctx ) {
  return ctx.metadata.title || ctx.t( 'title' ) || '';
}

module.exports = getTitle;
