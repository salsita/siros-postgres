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
yarn_install='yarn install --production=false'

install_one db-schema "${npm_install}"
install_one admin-scripts "${npm_install}"
install_one api-server "${npm_install}"
install_one web-client "${yarn_install}"
