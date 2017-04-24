'use strict';

/**
 * Returns the default marked renderer.
 * @param {marked} marked - The markdown processing object.
 * @returns {marked.Renderer} - The renderer object of the marked module.
 */
function markedRenderer( marked ) {

  return  new marked.Renderer();
}

module.exports = markedRenderer;
