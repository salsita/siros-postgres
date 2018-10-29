#!/bin/bash
set -e

function test_one {
  echo running tests in $1 ...
  cd $1
  result=`$2`
  echo "${result}"
  echo "... done"
  echo ""
  cd ..
}

npm_test='npm test'

test_one db-schema "${npm_test}"
test_one admin-scripts "${npm_test}"
