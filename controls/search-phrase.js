'use strict';

function searchPhrase( ctx ) {
  return  '<strong>' + ctx.data.text2search + '</strong>';
}

module.exports = searchPhrase;
