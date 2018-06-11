call plug#begin('~/.local/share/nvim/plugged')

Plug 'vim-syntastic/syntastic'

call plug#end()

filetype off
filetype plugin indent on

set tabstop=4

set shiftwidth=4

set expandtab
syntax on
set relativenumber

set autowrite
nnoremap <C-c> :!g++ -std=c++11 % -Wall -g -o %.out && ./%.out<CR>
