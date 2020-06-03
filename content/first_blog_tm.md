+++
title = "First Post ™"
date = 2020-06-03
[extra]
background = "linux.png"
+++
# First Post ™

Test post don't upvote.

## Vim bros

One thing I need to do for every post is put a title and a date on it in the
_frontmatter_.

That's annoying and easy to forget. Also if I update the post I need to change
these too.

Right now it has to look like this:

```
+++
title = "First Post ™"
date = 2020-06-03
[extra]
background = "linux.png"
+++
```

The background image has to be put there by hand since I have no way to deduce
the image's name, if there is one from the post.

So I went searching and found [this][vimAutoDate], under "Automatically update
timestamps".

```vim
" If buffer modified, update any 'Last modified: ' in the first 20 lines.
" 'Last modified: ' can have up to 10 characters before (they are retained).
" Restores cursor and window position using save_cursor variable.
function! LastModified()
  if &modified
    let save_cursor = getpos(".")
    let n = min([20, line("$")])
    keepjumps exe '1,' . n . 's#^\(.\{,10}Last modified: \).*#\1' .
          \ strftime('%a %b %d, %Y  %I:%M%p') . '#e'
    call histdel('search', -1)
    call setpos('.', save_cursor)
  endif
endfun
autocmd BufWritePre * call LastModified()
```

Which is fine and all but it's not good enough just yet, first it makes a guess
the 20 is the number of lines that matter, in my case there is a better
alternative, because the zone where this matters in inside `+++` I can just
fetch these.

```vim
call cursor(1, 1) " Put the cursor at the top
let l:st = search('+++', 'c') " Find the line where the first +++ appears
let l:end = search('+++') " Find the second +++
```

Then I just needed to get the current title and current date.

```vim
let l:title_line = search('^#[^#]') " Get the title line
let l:title = getline(l:title_line) " Get the text at that line
let l:title = substitute(l:title, "^#[ ]*", "", "") " Remove the # at the start
let l:now = strftime('%F') " Get the current date
```

With every thing ready it was just a matter of adapting the original find and
replace, to use the correct start and end lines, `l:st` and `l:end`, as well as
the correct pattern.
```vim
keepjumps exe l:st . ',' . l:end . 's/^title =.*/title = "' . l:title . '"/'
keepjumps exe l:st . ',' . l:end . 's/^date =.*/date = ' . l:now . '/'
```

The only other thing left to do was handle the obvious error. There might not be
any `+++` yet when I save, if I forget to add them (which I will) and for that I
just had to insert a check and create the boiler plate. This also gets around
the problem of there being random `+++` sequences in the article itself, like
this one does.

```vim
if l:st != 1 " front matter must be at line 1
    call append(0, ['+++',
                \ 'title =',
                \ 'date = ',
                \ '#[extra]',
                \ '#background = ""',
                \ '+++'])
    let l:st = 1  " I hard code these so that the find and replace
    let l:end = 6 " can find this zone.
endif
```

The final code looks like this:

```vim
function! BlogPostModified()
    if &modified
        let l:save_cursor = getpos(".")
        call cursor(1, 1)
        let l:st = search('+++', 'c')
        let l:end = search('+++')
        let l:title_line = search('^#[^#]')
        let l:title = getline(l:title_line)
        let l:title = substitute(l:title, "^#[ ]*", "", "")
        let l:now = strftime('%F')
        if l:st != 1
            call append(0, ['+++',
                        \ 'title =',
                        \ 'date = ',
                        \ '#[extra]',
                        \ '#background = ""',
                        \ '+++'])
            let l:st = 1
            let l:end = 6
        endif
        keepjumps exe l:st . ',' . l:end . 's/^title =.*/title = "' . l:title . '"/'
        keepjumps exe l:st . ',' . l:end . 's/^date =.*/date = ' . l:now . '/'
        call histdel('search', -1)
        call setpos('.', save_cursor)
    endif
endfun
autocmd BufWritePre content/*.md call BlogPostModified()
```

Done and I never have to worry about that in my life. _Until the script fails..._

## Result

![first_post_gif](/img/first_post.gif)

[vimAutoDate]: https://vim.fandom.com/wiki/Insert_current_date_or_time
