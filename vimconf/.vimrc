filetype plugin indent on
" show existing tab with 4 spaces width
set tabstop=4
" when indenting with '>', use 4 spaces width
set shiftwidth=4
" On pressing tab, insert 4 spaces
set expandtab

set relativenumber


if has('nvim')
    call plug#begin('~/.local/share/nvim/plugged')


else

    call plug#begin('~/.vim/plugged')
    Plug 'valloric/youcompleteme'
    Plug 'scrooloose/syntastic'



endif

call plug#end()

set autowrite
nnoremap <C-c> :!g++ -std=c++11 % -Wall -g -o %.out && ./%.out<CR>
