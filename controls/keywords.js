'use strict';

function getKeywords( ctx ) {
  return  merge( ctx.t( 'keywords' ), ctx.metadata.keywords, ', ' );
}

function merge( first, second, separator ) {
  var merged = first || '';
  merged += second ? separator + second : '';
  return merged;
}

module.exports = getKeywords;
