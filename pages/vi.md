- Registers are used to store text when you copy text for pasting. Your computer has multiple registers. By default, vim uses a register for its stored text that is different from the system’s copy stored text. Add the following to your .vimrc:
- set clipboard=unnamed
  set clipboard=unnamedplus
- With this addition, copied text from vim can be pasted by CTRL+V and copied text from CTRL+C can be pasted into vim with ‘p’.
- If you want to delete text without overwriting your register, you can run “_ before your command, such as: `“_dd` to delete a line.
- cnoremap kj <C-C>
  cnoremap jk <C-C>
- This allows you to escape with a ‘jk’ or ‘kj’ press, which leaves your hands right on the home row.
- An pet peeve in software engineering is when there are tabs instead of spaces and white space at the end of a line. You can add the following to your .vimrc:
- set list
- This shows a $ sign at the end of each line and shows ^I instead of tabs. This allows you to easily identify tabs and $ signs.
- Click CTRL + F to move forward quickly and CTRL + B to move backward quickly
  Click ‘zz’ to recenter the page so that your cursor is at the center
  When on a bracket such as ‘{‘ or ‘(‘, you can click ‘%’ to move to the other matching bracket