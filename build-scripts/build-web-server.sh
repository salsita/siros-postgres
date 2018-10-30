#!/bin/bash
set -e

# expecting to be in top-level directory
mkdir -p build
rm -f build/siros-web-server*.tgz
PACKAGE="siros-web-server@${npm_package_version}.tgz"
echo "creating $PACKAGE ..."
cd web-server
COPYFILE_DISABLE=1 tar cfz ../build/$PACKAGE nginx.conf nginx-mime.types
cd ..
echo "... done" && echo ""
