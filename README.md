# tree-sitter-confluence

Confluence wiki markup parser using tree-sitter

## Installation

In one of your neovim's init files, add the following:
```lua
local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
parser_config.confluence_wiki = {
  install_info = {
    url = 'https://github.com/fdev31/tree-sitter-confluence',
    files = { 'src/parser.c' },
    branch = 'main',
  },
  filetype = 'confluence_wiki', -- if you want to set the file type automatically
}
```


```sh
mkdir -p ~/.config/nvim/queries/confluence_wiki
cp queries/*.scm ~/.config/nvim/queries/confluence_wiki/
```

Quoting https://github.com/nvim-treesitter/nvim-treesitter

  Note that neither :TSInstall nor :TSInstallFromGrammar copy query files from the grammar repository. If you want your installed grammar to be useful, you must manually add query files to your local nvim-treesitter installation. Note also that module functionality is only triggered if your language's filetype is correctly identified. If Neovim does not detect your language's filetype by default, you can use Neovim's vim.filetype.add() to add a custom detection rule.

