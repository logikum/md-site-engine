'use strict';

/**
 * Creates an Object.assign() polyfill when it is not supported.
 */
function objectAssign() {
  if (typeof Object.assign !== 'function') {
    /**
     * Copies the values of all enumerable own properties from one or more
     * source objects to a target object. It will return the target object.
     * @param {object} target - The target object.
     * @param {...object} ...sources - The source object(s).
     * @returns {*}
     */
    Object.assign = function(target, sources) { // .length of function is 2
      'use strict';
      if (target === null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }
}

module.exports = objectAssign;
