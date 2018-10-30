#!/bin/bash
set -e

function set_ver {
  echo "setting version in $1 ..."
  cd $1
  npm --no-git-tag-version --allow-same-version version ${npm_package_version}
  echo "... done"
  echo ""
  cd ..
}

set_ver db-schema
set_ver admin-scripts
set_ver api-server
