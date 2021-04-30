wc -l pages/* | grep '\s4\s' | tr -s ' ' ' ' | cut -f 3-10 -d ' '
