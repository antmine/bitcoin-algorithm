#/usr/bin/sh

dir='build'
outFile1='btc-work-manager'
outFile2='miner'
ext='.js'
extMin='.min'${ext}

rm -rf $dir
mkdir $dir

cat sha256.js >> ${dir}/${outFile1}${ext}
cat util.js >> ${dir}/${outFile1}${ext}
cat work-manager.js >> ${dir}/${outFile1}${ext}
uglifyjs --compress --mangle -- ${dir}/${outFile1}${ext} > ${dir}/${outFile1}${extMin}

cat sha256.js >> ${dir}/${outFile2}${ext}
cat util.js >> ${dir}/${outFile2}${ext}
cat miner.js >> ${dir}/${outFile2}${ext}
uglifyjs --compress --mangle -- ${dir}/${outFile2}${ext} > ${dir}/${outFile2}${extMin}
