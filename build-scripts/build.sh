#!/bin/bash
set -e

function build_one {
  echo building $1 ...
  cd $1
  result=`$2`
  echo "${result}"
  echo "... done"
  echo ""
  cd ..
}

npm_build='npm run build'

build_one db-schema "${npm_build}"
build_one admin-scripts "${npm_build}"
build_one api-server "${npm_build}"
./build-scripts/build-web-server.sh

echo "resulting artifacts:"
echo ""
ls -l build/
