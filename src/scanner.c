#include "tree_sitter/parser.h"
#include <string.h>

enum TokenType {
  CODE_BODY,
};

// Check if the upcoming characters match a given string.
static bool lookahead_match(TSLexer *lexer, const char *s) {
  for (unsigned i = 0; s[i] != '\0'; i++) {
    if (lexer->lookahead != (uint32_t)s[i]) {
      return false;
    }
    lexer->advance(lexer, false);
  }
  return true;
}

void *tree_sitter_confluence_wiki_external_scanner_create(void) {
  return NULL;
}

void tree_sitter_confluence_wiki_external_scanner_destroy(void *payload) {
  // nothing to free
}

unsigned tree_sitter_confluence_wiki_external_scanner_serialize(
    void *payload, char *buffer) {
  return 0;
}

void tree_sitter_confluence_wiki_external_scanner_deserialize(
    void *payload, const char *buffer, unsigned length) {
  // nothing to restore
}

bool tree_sitter_confluence_wiki_external_scanner_scan(
    void *payload, TSLexer *lexer, const bool *valid_symbols) {

  if (!valid_symbols[CODE_BODY]) {
    return false;
  }

  // Scan forward, consuming everything until we see "{code}" (the closing tag).
  // We need to stop *before* the "{code}" so the grammar can match it.
  bool has_content = false;

  while (lexer->lookahead != 0) {
    // Check for the closing {code} tag
    if (lexer->lookahead == '{') {
      // Mark the end position before we try to match
      lexer->mark_end(lexer);

      // Try to match "{code}"
      lexer->advance(lexer, false);
      if (lexer->lookahead == 'c') {
        lexer->advance(lexer, false);
        if (lexer->lookahead == 'o') {
          lexer->advance(lexer, false);
          if (lexer->lookahead == 'd') {
            lexer->advance(lexer, false);
            if (lexer->lookahead == 'e') {
              lexer->advance(lexer, false);
              if (lexer->lookahead == '}') {
                // We found "{code}" — stop before it.
                // mark_end was already called before we started matching.
                if (has_content) {
                  lexer->result_symbol = CODE_BODY;
                  return true;
                }
                return false;
              }
            }
          }
        }
      }
      // Not a closing tag — the characters we consumed during lookahead
      // are part of the code body. Continue scanning.
      has_content = true;
      continue;
    }

    has_content = true;
    lexer->advance(lexer, false);
  }

  // Reached EOF without finding {code} — return what we have as code body
  // so the parser can produce an error for the unclosed block.
  if (has_content) {
    lexer->mark_end(lexer);
    lexer->result_symbol = CODE_BODY;
    return true;
  }

  return false;
}
