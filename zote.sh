pagesDir=$(pwd)/pages

git pull
pushd ~/prog/logseq-zotero
sh run.sh $pagesDir
popd
sh ./commit-everything-xd.sh
