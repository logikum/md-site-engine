'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );

var getComponent = require( './get-component.js' );
var getSegment = require( './get-segment.js' );

var languages = [ ];

function readComponents(
  componentPath,
  referenceFile,
  layoutSegment,
  contentSegment,
  filingCabinet,
  renderer
) {
  logger.showInfo( '*** Reading components...' );

  // Initialize the store.
  getComponents(
    componentPath, 0, '', referenceFile, layoutSegment, contentSegment,
    filingCabinet.references,
    filingCabinet.documents,
    filingCabinet.layouts,
    filingCabinet.segments,
    filingCabinet.locales,
    renderer, ''
  );
}

function getComponents(
  componentDir, level, levelPath, referenceFile, layoutSegment, contentSegment,
  referenceDrawer, documentDrawer, layoutDrawer, segmentDrawer, localeDrawer,
  renderer, language
) {

  // Read directory items.
  var componentPath = path.join( process.cwd(), componentDir );
  var items = fs.readdirSync( componentPath );

  items.forEach( function ( item ) {

    var typeName = 'Component';

    var itemPath = path.join( componentDir, item );
    var prefix = levelPath === '' ? '' : levelPath + '/';

    // Get item info.
    var stats = fs.statSync( path.join( process.cwd(), itemPath ) );

    if (stats.isDirectory()) {

      if (level === 0) {

        // Collect languages.
        languages.push( item );
        logger.localeFound( typeName, item );
      }

      // Get sub level components.
      getComponents(
        itemPath, level + 1, prefix + item, referenceFile, layoutSegment, contentSegment,
        referenceDrawer, documentDrawer, layoutDrawer, segmentDrawer, localeDrawer,
        renderer, level === 0 ? item : language
      );
    }
    else if (stats.isFile()) {

      var ext = path.extname( item );
      var componentPath = prefix + path.basename( item, ext );

      switch (ext) {

        case '.txt':
          // Process the text file.
          if (level < 2 && path.basename( item ) === referenceFile) {
            // References are already processed.
          } else
            logger.fileSkipped( typeName, itemPath );
          break;

        case '.html':
          // Read component.
          var component = getComponent( itemPath, layoutSegment, contentSegment );
          if (component.isDocument){
            documentDrawer.add( componentPath, component );
            logger.fileProcessed( 'Document', itemPath );
          } else if (component.isLayout) {
            layoutDrawer.add( componentPath, component );
            logger.fileProcessed( 'Layout', itemPath );
          } else if (level > 0) {
            segmentDrawer.add( componentPath, component );
            logger.fileProcessed( 'Segment', itemPath );
          } else
            logger.fileSkipped( typeName, itemPath );
          break;

        case '.md':
          if (level > 0) {
            // Read segment.
            var segment = getSegment(
              itemPath, language, referenceDrawer, renderer, layoutSegment, contentSegment
            );
            segmentDrawer.add( componentPath, segment );
            logger.fileProcessed( 'Segment', itemPath );
          } else
            logger.fileSkipped( typeName, itemPath );
          break;

        case '.json':
          if (level > 0) {
            // Read locales.
            var locales = require( path.join( process.cwd(), itemPath ) );
            var localePrefix = item === 'default.json' ? prefix : componentPath + '/';
            localeDrawer.add( localePrefix, locales );
            logger.fileProcessed( 'Locale', itemPath );
          } else
            logger.fileSkipped( typeName, itemPath );
          break;

        default:
          logger.fileSkipped( typeName, itemPath );
          break;
      }
    } else
      logger.fileSkipped( typeName, itemPath );
  } )
}

module.exports = readComponents;
