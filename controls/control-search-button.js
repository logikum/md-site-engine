'use strict';

function controlSearchButton( ctx ) {
  return ctx.searchPath ?
    '\n' +
    '<script>\n' +
    '  (function() {\n' +
    '    $("input[name=text2search]").keyup(function() {\n' +
    '      var submit = $(this).closest("form").find(":submit");\n' +
    '      if ($(this).val().length < 3)\n' +
    '        submit.attr("disabled","disabled");\n' +
    '      else\n' +
    '        submit.removeAttr("disabled");\n' +
    '    });\n' +
    '  })();\n' +
    '</script>\n' +
    '\n'
    :
    '';
}

module.exports = controlSearchButton;
