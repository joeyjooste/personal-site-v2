#!/usr/bin/env sh
set -eu

if opam switch list --short | grep -Fxq "$PWD"; then
  site_switch=.
else
  site_switch="${OPAMSWITCH:-default}"
fi
eval "$(opam env --switch="$site_switch" --shell=sh)"
dune build --profile release ./src/main.bc.js
rm -rf dist
mkdir -p dist public
rm -f public/main.bc.js
cp _build/default/src/main.bc.js public/main.bc.js
cp _build/default/src/main.bc.js dist/main.bc.js
cp index.html dist/index.html
cp -R public/fonts dist/fonts
cp -R public/art dist/art
