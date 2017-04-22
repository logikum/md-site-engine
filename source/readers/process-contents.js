'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var marked = require( 'marked' );
var logger = require( './../utilities/logger.js' );
var getContent = require( './get-content.js' );
var getDefinition = require( './get-definition.js' );
var MenuBuilder = require( './menu-builder.js' );

function processContents(
  language, contentDir, contentRoot,
  submenuFile, contentStock, menuStock, references,
  renderer
) {

  var typeName = 'Content';

  // Read directory items.
  var items = fs.readdirSync( path.join( process.cwd(), contentDir ) );

  items.forEach( function ( item ) {

    // Get full path of item.
    var itemPath = path.join( contentDir, item );
    // Get item info.
    var stats = fs.statSync( path.join( process.cwd(), itemPath ) );

    if (stats.isDirectory()) {

      // Determine content path.
      var directoryPath = contentRoot + '/' + item;
      // Create menu item.
      var directoryNode = MenuBuilder.buildSubMenu(
        menuStock, path.join( itemPath, submenuFile ), directoryPath
      );

      // Read subdirectory.
      processContents(
        language,
        itemPath,
        directoryPath,
        submenuFile,
        contentStock,
        directoryNode ? directoryNode.children : menuStock,
        references
      );
    }
    else if (stats.isFile()) {

      var ext = path.extname( item );
      var basename = path.basename( item, ext );
      var isMarkdown = true;

      switch (ext) {
        case '.html':
          isMarkdown = false;
        case '.md':
          // Read the content file.
          var content = getContent( itemPath, isMarkdown ? "markdown" : 'html' );

          // Set content path.
          content.path = contentRoot + '/' + basename;

          // Read content definition.
          var definition = getDefinition( content );

          // Contains menu info?
          if (definition.order || definition.text)
            // Create menu item.
            MenuBuilder.createMenuItem( menuStock, definition, content.path, false );

          // Generate HTML from markdown text.
          if (isMarkdown)
            content.html = marked(
              content.html + '\n' + references.get( language ),
              { renderer: renderer }
            );

          // Omit menu separator.
          if (definition.text !== '---')
            // Store content.
            contentStock.add( content, definition );

          logger.fileProcessed( typeName, itemPath );
          break;
        default:
          if (item !== submenuFile)
            logger.fileSkipped( typeName, itemPath );
          break;
      }
    }
  } );
}

module.exports = processContents;
