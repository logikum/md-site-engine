
function getKeywords( ctx ) {
  return  merge( ctx.texts.keywords, ctx.definition.keywords, ', ' );
}

function merge( first, second, separator ) {
  var merged = first || '';
  merged += second ? separator + second : '';
  return merged;
}

module.exports = getKeywords;
