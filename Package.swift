// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterConfluenceWiki",
    products: [
        .library(name: "TreeSitterConfluenceWiki", targets: ["TreeSitterConfluenceWiki"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterConfluenceWiki",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterConfluenceWikiTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterConfluenceWiki",
            ],
            path: "bindings/swift/TreeSitterConfluenceWikiTests"
        )
    ],
    cLanguageStandard: .c11
)
