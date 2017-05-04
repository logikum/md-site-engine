'use strict';

function controlSearchButton( ctx ) {
  return ctx.searchPath ?
    '\n' +
    '<script>\n' +
    '  (function() {\n' +
    '    $("input[name=text2search]").keyup(function() {\n' +
    '      var empty = false;\n' +
    '      if ($(this).val().length < 3)\n' +
    '        empty = true;\n' +
    '      if (empty)\n' +
    '        $(this).closest("form").find(":submit").attr("disabled", "disabled");\n' +
    '      else\n' +
    '        $(this).closest("form").find(":submit").removeAttr("disabled");\n' +
    '    });\n' +
    '  })()\n' +
    '</script>\n' +
    '\n'
    :
    '';
}

module.exports = controlSearchButton;
