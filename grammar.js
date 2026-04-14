module.exports = grammar({
  name: 'confluence_wiki',

  externals: $ => [
    $.code_body,
  ],

  extras: $ => [/[ \t]/],

  rules: {
    document: $ => repeat(choice($._block, $._newline)),

    _newline: $ => /\n|\r\n?/,

    _block: $ => choice(
      $.heading,
      $.bullet_list,
      $.numbered_list,
      $.code_block,
      $.panel_block,
      $.quote_block,
      $.table,
      $._paragraph,
    ),

    // ── Headings ──────────────────────────────────────────────
    heading: $ => choice(
      $.h1_heading, $.h2_heading, $.h3_heading,
      $.h4_heading, $.h5_heading, $.h6_heading,
    ),

    h1_heading: $ => seq(token(prec(10, 'h1. ')), repeat($._inline), $._newline),
    h2_heading: $ => seq(token(prec(10, 'h2. ')), repeat($._inline), $._newline),
    h3_heading: $ => seq(token(prec(10, 'h3. ')), repeat($._inline), $._newline),
    h4_heading: $ => seq(token(prec(10, 'h4. ')), repeat($._inline), $._newline),
    h5_heading: $ => seq(token(prec(10, 'h5. ')), repeat($._inline), $._newline),
    h6_heading: $ => seq(token(prec(10, 'h6. ')), repeat($._inline), $._newline),

    // ── Lists ─────────────────────────────────────────────────
    bullet_list: $ => prec.right(repeat1(choice(
      $.bullet_list_item1,
      $.bullet_list_item2,
      $.bullet_list_item3,
      $.bullet_list_item4,
      $.bullet_list_item5,
    ))),

    bullet_list_item1: $ => seq(token(prec(10, '* ')), repeat($._inline), $._newline),
    bullet_list_item2: $ => seq(token(prec(10, '** ')), repeat($._inline), $._newline),
    bullet_list_item3: $ => seq(token(prec(10, '*** ')), repeat($._inline), $._newline),
    bullet_list_item4: $ => seq(token(prec(10, '**** ')), repeat($._inline), $._newline),
    bullet_list_item5: $ => seq(token(prec(10, '***** ')), repeat($._inline), $._newline),

    numbered_list: $ => prec.right(repeat1($.numbered_list_item)),

    numbered_list_item: $ => seq(token(prec(10, '# ')), repeat($._inline), $._newline),

    // ── Code blocks ───────────────────────────────────────────
    language: $ => /[a-zA-Z][a-zA-Z0-9_]*/,

    code_block: $ => seq(
      token(prec(10, '{code')),
      optional(seq(':', field('language', $.language))),
      '}',
      optional($._newline),
      optional(field('body', $.code_body)),
      token(prec(10, '{code}')),
    ),

    // ── Panel block ───────────────────────────────────────────
    key_value: $ => seq(
      optional('|'),
      /[a-zA-Z]+/,
      '=',
      /[^|}]+/,
    ),

    panel_block: $ => prec.right(seq(
      token(prec(10, '{panel')),
      optional(seq(':', repeat1($.key_value))),
      '}',
      repeat(choice($._block, $._newline)),
      token(prec(10, '{panel}')),
    )),

    // ── Quote block ───────────────────────────────────────────
    quote_block: $ => seq(
      token(prec(10, '{quote}')),
      repeat(choice($._inline, $._newline)),
      token(prec(10, '{quote}')),
    ),

    // ── Table ─────────────────────────────────────────────────
    table: $ => prec.right(seq(
      repeat($.table_header),
      repeat1(seq($.table_row, $._newline)),
    )),

    table_header: $ => seq(
      '||',
      repeat1(seq($.table_header_cell, '||')),
      $._newline,
    ),

    table_row: $ => seq(
      '|',
      repeat1(seq($.table_cell, '|')),
    ),

    table_cell: $ => repeat1($._inline),
    table_header_cell: $ => /[^|\n]+/,

    // ── Paragraphs ────────────────────────────────────────────
    _paragraph: $ => prec(-1, seq(repeat1($._inline), $._newline)),

    // ── Inline content ────────────────────────────────────────
    _inline: $ => choice(
      $.bold,
      $.italic,
      $.monospace,
      $.strikethrough,
      $.color,
      $.image,
      $.link,
      $.url,
      $.text,
      // Single-character fallback for unmatched formatting delimiters.
      // This ensures characters like *, _, -, etc. that don't form a
      // valid inline construct are still consumed as plain text.
      alias(token(prec(-2, /[*_\-{}\[\]!|:\/#]/)), $.text),
    ),

    // text: runs of characters that don't contain formatting delimiters or newlines.
    // Excludes formatting delimiters, whitespace, newlines, colons, hashes, and slashes.
    // Whitespace is handled by extras. Colons/slashes are excluded so URL tokens
    // can match at word boundaries (longest match rule).
    text: $ => /[^\s*_\-{}\[\]!|:\/#]+/,

    // Bold: *content* — single token, prec(2) to beat text on equal length
    bold: $ => token(prec(2, seq('*', /[^*\n]+/, '*'))),

    // Italic: _content_ — single token
    italic: $ => token(prec(2, seq('_', /[^_\n]+/, '_'))),

    // Strikethrough: -content- — single token
    strikethrough: $ => token(prec(2, seq('-', /[^\-\n]+/, '-'))),

    monospace: $ => seq(
      token(prec(10, '{{')),
      alias(repeat(/[^}\n]/), $.monospace_content),
      token(prec(10, '}}')),
    ),

    url: $ => token(prec(5, /https?:\/\/[^\s\]]+/)),

    image: $ => seq(
      '!',
      /[a-zA-Z.][^|!\n]+/,
      optional(seq('|', /[^|!\n]+/)),
      '!',
    ),

    link: $ => seq(
      '[',
      /[^|\]\n]+/,
      optional(seq('|', /[^|\]\n]+/)),
      ']',
    ),

    colorcode: $ => /[a-zA-Z#0-9]+/,
    color_start: $ => seq(token(prec(10, '{color:')), $.colorcode, '}'),
    color_end: $ => token(prec(10, '{color}')),

    color: $ => seq(
      $.color_start,
      repeat($._inline),
      $.color_end,
    ),
  },
});
