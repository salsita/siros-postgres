#!/bin/bash
set -e

# expecting to be in 'db-schema' directory already
npm ci --production
mkdir -p ../build
rm -f ../build/siros-db-schema*.tgz
PACKAGE="siros-db-schema@${npm_package_version}.tgz"
echo "creating $PACKAGE ..."
COPYFILE_DISABLE=1 tar cfz ../build/$PACKAGE migrations package.json node_modules
echo "... done" && echo ""
npm ci --no-production
