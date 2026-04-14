# tree-sitter-confluence

Confluence wiki markup parser using tree-sitter

## Installation (Neovim)

### 1. Register the parser

In one of your Neovim plugin/init files, register the custom parser so
nvim-treesitter knows where to fetch it. The `queries = 'queries'` key tells
it to pull highlight/injection queries straight from this repository -- no
manual copy step is needed.

```lua
local confluence_wiki_parser = {
  install_info = {
    url = 'https://github.com/fdev31/tree-sitter-confluence',
    branch = 'main',
    queries = 'queries',
  },
}

local ok, parsers = pcall(require, 'nvim-treesitter.parsers')
if ok then
  parsers.confluence_wiki = confluence_wiki_parser
end
```

### 2. Filetype detection

Map the `.wiki` extension (or any pattern you prefer) to the
`confluence_wiki` filetype:

```lua
vim.filetype.add({
  extension = {
    wiki = 'confluence_wiki',
  },
})
```

### 3. Auto-install on first use (optional)

Place the following in `after/ftplugin/confluence_wiki.lua` so the parser is
compiled automatically the first time you open a `.wiki` file:

```lua
local ok = pcall(vim.treesitter.language.add, 'confluence_wiki')
if not ok then
  pcall(function()
    require('nvim-treesitter').install({ 'confluence_wiki' })
  end)
end
```

After that, `:TSInstall confluence_wiki` (or simply opening a `.wiki` file if
you set up auto-install) is all you need.

