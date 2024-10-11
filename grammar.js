const nocode = /[^\n]*(\n[^{]*|\n\{[^c]*|\n\{c[^o]*|\n\{co[^d]*|\n\{cod[^e]*|\n\{code[^}]*|\n\{code\}.*)/;
// do not allow '{{' sequence:
const nobracket = /[^{]*/;

module.exports = grammar({
  name: 'confluence_wiki',

  rules: {
    document: $ => repeat($._block),

    _block: $ => prec(5, choice(
      $.numbered_list,
      prec(5, $.bullet_list),
      $.heading,
      $._paragraph,
      $.code_block,
      $.panel_block,
      $.quote_block,
      $.table,
    )),

    numbered_list: $ => prec.left(seq(repeat1($.numbered_list_item), '\n\n')),

    numbered_list_item: $ => prec.left(seq(
      '# ',
      repeat($._inline_content),
    )),

    bullet_list: $ => prec.left(seq(repeat1(choice(
      $.bullet_list_item1, $.bullet_list_item2, $.bullet_list_item3, $.bullet_list_item4, $.bullet_list_item5
    )), '\n\n')),

    bullet_list_item1: $ => prec.left(seq('* ', repeat($._inline_content))),
    bullet_list_item2: $ => prec.left(seq('** ', repeat($._inline_content))),
    bullet_list_item3: $ => prec.left(seq('*** ', repeat($._inline_content))),
    bullet_list_item4: $ => prec.left(seq('**** ', repeat($._inline_content))),
    bullet_list_item5: $ => prec.left(seq('***** ', repeat($._inline_content))),

    heading: $ => choice($.h1_heading, $.h2_heading, $.h3_heading, $.h4_heading, $.h5_heading, $.h6_heading),

    h1_heading: $ => prec.right(seq(
      'h1. ',
      repeat($._inline_content),
      '\n'
    )),
    h2_heading: $ => prec.right(seq(
      'h2. ',
      repeat($._inline_content),
      '\n'
    )),
    h3_heading: $ => prec.right(seq(
      'h3. ',
      repeat($._inline_content),
      '\n'
    )),
    h4_heading: $ => prec.right(seq(
      'h4. ',
      repeat($._inline_content),
      '\n'
    )),
    h5_heading: $ => prec.right(seq(
      'h5. ',
      repeat($._inline_content),
      '\n'
    )),
    h6_heading: $ => prec.right(seq(
      'h6. ',
      repeat($._inline_content),
      '\n'
    )),

    _paragraph: $ => prec.left(repeat1($._inline_content)),

    _inline_content: $ => choice(
      $.bold,
      $.color,
      $.image,
      $.italic,
      $.link,
      $.monospace,
      $.strikethrough,
      $.text,
      $.url,
    ),

    text: $ => prec(-1, /[^\s\n*_\-{}!\[\]|]+/),

    bold: $ => /[*][^*\n]+[*]/,

    italic: $ => seq(
      / _[^_]/,
      repeat1($.text),
      '_'
    ),

    strikethrough: $ => seq(
      /-[^- ]/,
      repeat1($._inline_content_no_strikethrough),
      '-'
    ),

    _inline_content_no_strikethrough: $ => choice(
      $.text,
      $.bold,
      $.italic,
      $.monospace,
      $.url,
      $.color,
      $.image,
      $.link
    ),

    monospace: $ => seq(
      '{{',
      repeat(/[^{]/),
      prec(2, '}}')
    ),

    _inline_content_no_monospace: $ => choice(
      $.text,
      $.bold,
      $.italic,
      $.strikethrough,
      $.url,
      $.color,
      $.image,
      $.link
    ),

    url: $ => /https?:\/\/[^\s\]]+/,

    image: $ => seq(
      '!',
      /[a-zA-Z.][^\|!]+/,
      optional(seq('|', /[^\|!]+/)),
      '!',
    ),

    link: $ => seq(
      '[',
      /[^\|\]]+/,
      optional(seq('|', /[^\|\]]+/)),
      ']'
    ),


    colorcode: $ => prec(-1, /[a-zA-Z#0-9]+/),
    color_start: $ => seq('{color:', $.colorcode, '}'),
    color_end: $ => '{color}',

    color: $ => seq(
      $.color_start,
      repeat($._inline_content),
      $.color_end
    ),

    language: $ => /[a-z]+/,
    code_start: $ => prec(9, seq('{code', optional(seq(':', $.language)), '}')),
    code_end: $ => prec(10, '{code}'),
    code_body: $ => prec(5, nocode),

    js_code_start: $ => prec(9, '{code:js}'),
    js_code_body: $ => prec(5, nocode),
    js_code_block: $ => seq(
      $.js_code_start,
      $.js_code_body,
      $.code_end,
    ),

    json_code_start: $ => prec(9, '{code:json}'),
    json_code_body: $ => prec(5, nocode),
    json_code_block: $ => seq(
      $.json_code_start,
      $.json_code_body,
      $.code_end,
    ),

    base_code_block: $ => seq(
      $.code_start,
      $.code_body,
      $.code_end,
    ),

    code_block: $ => choice($.base_code_block, $.js_code_block, $.json_code_block),

    key_value: $ => prec.left(seq(
      /[a-zA-Z]+/,
      '=',
      /[^\s}|:]+\|?/,
    )),
    panel_block: $ => prec.right(seq(
      '{panel',
      optional(seq(':', repeat1(seq($.key_value, '|')))),
      '}',
      repeat($._block),
      '{panel}'
    )),

    quote_block: $ => seq(
      '{quote}',
      repeat($._inline_content),
      '{quote}'
    ),

    table: $ => prec.right(seq(repeat($.table_header), repeat1(seq($.table_row, '\n')))),

    table_header: $ => prec.left(seq(
      '||',
      repeat1(seq($.table_header_cell, '||')),
    )),

    table_row: $ => prec.left(seq(
      '|',
      repeat1(seq($.table_cell, '|')),
    )),

    table_cell: $ => /[^|]+/,
    table_header_cell: $ => /[^|]+/,

  },

  extras: $ => [/[\s]/],

  precedences: $ => [
    [
      'heading',
      'block',
      'table',
      'panel_block',
      'quote_block',
      'code_block',
      '_paragraph',
      'bullet_list',
      'numbered_list_item',
      'bold',
      'italic',
      'strikethrough',
      'monospace',
      'url',
      'color',
      'image',
      'link',
      'inline',
      'text'
    ]
  ]
});
