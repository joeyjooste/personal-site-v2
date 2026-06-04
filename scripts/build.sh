#!/usr/bin/env sh
set -eu

eval "$(opam env --switch=. --shell=sh)"
dune build ./src/main.bc.js
rm -rf dist
mkdir -p dist public
rm -f public/main.bc.js
cp _build/default/src/main.bc.js public/main.bc.js
cp _build/default/src/main.bc.js dist/main.bc.js
cp index.html dist/index.html
cp -R public/fonts dist/fonts
