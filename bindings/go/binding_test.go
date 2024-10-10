package tree_sitter_confluence_wiki_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_confluence_wiki "github.com/fdev31/tree-sitter-confluence/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_confluence_wiki.Language())
	if language == nil {
		t.Errorf("Error loading ConfluenceWiki grammar")
	}
}
