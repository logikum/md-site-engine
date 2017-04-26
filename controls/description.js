'use strict';

function getDescription( ctx ) {
  return  ctx.metadata.description || '';
}

module.exports = getDescription;
