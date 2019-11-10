#!/usr/bin/env bash
gitbook build
git add .
git commit -m $1
git push -u origin master
git branch -D gh-pages
git checkout -b gh-pages
ls | grep -v "_book" | xargs rm -rf
mv  _book/* .
git add .
git commit -m $1
git push -f origin gh-pages
git checkout master
