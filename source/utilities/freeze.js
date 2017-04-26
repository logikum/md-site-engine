'use strict';

/**
 * Freezes the target object, including the object properties (deep freeze).
 * @param {object} target - The object to freeze.
 */
function freeze( target ) {
  for (var property in target) {
    if (typeof target[ property ] === 'object')
      freeze( target[ property ] );
  }
  Object.freeze( target );
}

module.exports = freeze;
