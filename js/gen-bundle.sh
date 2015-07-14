#!/bin/bash

BUNDLE="bundle.js"
MIN_BUNDLE="bundle.min.js"
MAP="bundle.min.map"

#cat jquery-1.10.2.min.js > $BUNDLE
#cat prefixfree.min.js >> $BUNDLE
#cat html5shiv-printshiv.js  >> $BUNDLE

uglifyjs --verbose jquery-1.10.2.js prefixfree.js html5shiv-printshiv.js --output $MIN_BUNDLE --source-map $MAP
