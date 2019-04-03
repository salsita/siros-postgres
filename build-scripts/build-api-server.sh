#!/bin/bash
set -e

# expecting to be in 'api-server' directory already
npm ci --production
mkdir -p ../build
rm -f ../build/siros-api-server*.tgz
PACKAGE="siros-api-server@${npm_package_version}.tgz"
echo "creating $PACKAGE ..."
COPYFILE_DISABLE=1 tar cfz ../build/$PACKAGE package.json server.js lib node_modules
echo "... done" && echo ""
npm ci --no-production
