'use strict';

function freeze( target ) {
  for (var property in target) {
    if (typeof target[ property ] === 'object')
      freeze( target[ property ] );
  }
  Object.freeze( target );
}

module.exports = freeze;
