#!/bin/bash
set -e

# expecting to be in 'web-client' directory already
mkdir -p ../build
rm -f ../build/siros-web-client*.tgz
PACKAGE="siros-web-client@${npm_package_version}.tgz"
echo "creating $PACKAGE ..."
yarn run gen-ver
SKIP_PREFLIGHT_CHECK=true yarn run bundle
COPYFILE_DISABLE=1 tar cfz ../build/$PACKAGE build/
echo "... done" && echo ""
