# tree-sitter-confluence

Confluence wiki markup parser using tree-sitter

Alpha quality

Need to install highlights by hand, eg## Installation

In one of your neovim's init files, add the following:
```lua
local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
parser_config.confluence_wiki = {
  install_info = {
    url = 'https://github.com/fdev31/tree-sitter-confluence',
    files = { 'src/parser.c' },
    branch = 'main',
  },
  filetype = 'confluence_wiki', -- if you want to set the filetype automatically
}
```


```sh
mkdir -p ~/.config/nvim/queries/confluence_wiki
cp queries/highlights.scm ~/.config/nvim/queries/confluence_wiki/highlights.scm
```

# TODO

- syntax highlighting injections
- fix highlights.scm installation
