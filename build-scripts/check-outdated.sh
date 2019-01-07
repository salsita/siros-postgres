#!/bin/bash

function check_one {
  echo "checking for outdated packages in $1 ..."
  cd $1
  result=`$2`
  echo "${result}"
  echo "... done"
  echo ""
  cd ..
}

npm_test='npm outdated'
yarn_test='yarn outdated'

check_one db-schema "${npm_test}"
check_one admin-scripts "${npm_test}"
check_one api-server "${npm_test}"
check_one web-client "${yarn_test}"
