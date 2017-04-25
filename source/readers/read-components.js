'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );

var getComponent = require( './get-component.js' );
var getSegment = require( './get-segment.js' );

var languages = [ ];

/**
 * Reads all components.
 * @param {string} componentPath - The path of the components directory.
 * @param {string} referenceFile - The name of the reference files.
 * @param {string} localeFile - The name of the default locale file.
 * @param {string} layoutSegment - The name of the layout segment.
 * @param {string} contentSegment - The name of the layout segment.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @param {marked.Renderer} renderer - The custom markdown renderer.
 */
function readComponents(
  componentPath,
  referenceFile, localeFile, layoutSegment, contentSegment,
  filingCabinet, renderer
) {
  logger.showInfo( '*** Reading components...' );

  // Initialize the store.
  getComponents(
    componentPath, 0, '',
    referenceFile, localeFile, layoutSegment, contentSegment,
    filingCabinet.references,
    filingCabinet.documents,
    filingCabinet.layouts,
    filingCabinet.segments,
    filingCabinet.locales,
    renderer, ''
  );
}

/**
 * Reads all components in a component sub-directory.
 * @param {string} componentDir - The path of the component sub-directory.
 * @param {number} level - The level depth compared to the components directory.
 * @param {string} levelPath - The base URL of the component sub-directory.
 * @param {string} referenceFile - The name of the reference files.
 * @param {string} localeFile - The name of the default locale file.
 * @param {string} layoutSegment - The name of the layout segment.
 * @param {string} contentSegment - The name of the layout segment.
 * @param {ReferenceDrawer} referenceDrawer - The reference storage.
 * @param {DocumentDrawer} documentDrawer - The document storage.
 * @param {LayoutDrawer} layoutDrawer - The layout storage.
 * @param {SegmentDrawer} segmentDrawer - The segment storage.
 * @param {LocaleDrawer} localeDrawer - The locale storage.
 * @param {marked.Renderer} renderer - The custom markdown renderer.
 * @param {string} language - The language of the sub-directory.
 */
function getComponents(
  componentDir, level, levelPath,
  referenceFile, localeFile, layoutSegment, contentSegment,
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
        itemPath, level + 1, prefix + item,
        referenceFile, localeFile, layoutSegment, contentSegment,
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
            // Unused file.
            logger.fileSkipped( typeName, itemPath );
          break;

        case '.html':
          // Read component.
          var component = getComponent( itemPath, layoutSegment, contentSegment );
          if (component.isDocument) {
            documentDrawer.add( componentPath, component );
            logger.fileProcessed( 'Document', itemPath );
          } else if (component.isLayout) {
            layoutDrawer.add( componentPath, component );
            logger.fileProcessed( 'Layout', itemPath );
          } else {
            segmentDrawer.add( componentPath, component );
            logger.fileProcessed( 'Segment', itemPath );
          }
          break;

        case '.md':
          // Read segment.
          var segment = getSegment(
            itemPath, layoutSegment, contentSegment, referenceDrawer, language, renderer
          );
          segmentDrawer.add( componentPath, segment );
          logger.fileProcessed( 'Segment', itemPath );
          break;

        case '.json':
          if (level > 0) {
            // Read locales.
            var locales = require( path.join( process.cwd(), itemPath ) );
            var localePrefix = item === localeFile ? prefix : componentPath + '/';
            localeDrawer.add( localePrefix, locales );
            logger.fileProcessed( 'Locale', itemPath );
          } else
            // Unused file.
            logger.fileSkipped( typeName, itemPath );
          break;

        default:
          // Unused file.
          logger.fileSkipped( typeName, itemPath );
          break;
      }
    } else
      // Unused file.
      logger.fileSkipped( typeName, itemPath );
  } )
}

module.exports = readComponents;
