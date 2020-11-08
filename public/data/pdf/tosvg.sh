#!/bin/bash
for filename in *.pdf; do
    pdf2svg $filename ${filename%.*}-%d.svg all
done
