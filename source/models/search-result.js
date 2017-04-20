'use strict';

var SearchResult = function( definition, priority ) {

  this.title = definition.title || definition.path;
  this.description = definition.description;
  this.path = definition.path;
  this.priority = priority;

  Object.freeze( this );
};

module.exports = SearchResult;
