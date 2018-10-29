#!/bin/bash
set -e

function install_one {
  echo installing packages in $1 ...
  cd $1
  result=`$2`
  echo "${result}"
  echo "... done"
  echo ""
  cd ..
}

npm_install='npm install --no-production'

install_one db-schema "${npm_install}"
install_one admin-scripts "${npm_install}"
