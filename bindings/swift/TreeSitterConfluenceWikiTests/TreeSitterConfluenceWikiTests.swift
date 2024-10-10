import XCTest
import SwiftTreeSitter
import TreeSitterConfluenceWiki

final class TreeSitterConfluenceWikiTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_confluence_wiki())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading ConfluenceWiki grammar")
    }
}
