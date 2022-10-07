#!/bin/bash

wget -nv -P src/lib/v86/ https://github.com/AlexAltea/capstone.js/releases/download/v3.0.5-rc1/capstone-x86.min.js

mkdir -p tmp
wget -nv -P tmp https://github.com/WebAssembly/wabt/archive/1.0.6.zip
unzip -j -d src/lib/v86/ tmp/1.0.6.zip wabt-1.0.6/demo/libwabt.js
rm -r tmp
