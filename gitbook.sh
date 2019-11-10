#!/usr/bin/env bash
git checkout master
git add .
git commit -m $1
git push -u origin master
git checkout gh-pages
git merge master -s subtree
git push
cp -r _book/* .
git add .
git commit -m $1
git push -u origin gh-pages
git checkout master
