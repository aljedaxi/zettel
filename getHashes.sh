git log --pretty=format:"%H" --after="2021-03-07" --until="2021-03-15" -- pages > meme.txt
for hash in `cat meme.txt`
do
	git show $hash | grep '^+' | grep -v '^+++' | grep -v "^+---" | grep -v 'title:' | grep -v '^+:' >> shows.txt
done
