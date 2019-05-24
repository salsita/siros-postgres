#!/bin/bash
set -e

# expecting to be in 'admin-scripts' directory already
npm ci --production
mkdir -p ../build
rm -f ../build/siros-admin-scripts*.tgz
PACKAGE_NIX="siros-admin-scripts@${npm_package_version}-nix.tgz"
PACKAGE_WIN="siros-admin-scripts@${npm_package_version}-win.zip"
rm -rf protocols
mkdir protocols
echo "creating $PACKAGE_NIX ..."
COPYFILE_DISABLE=1 tar cfz ../build/$PACKAGE_NIX --exclude='bin/siros*.cmd' --exclude='bin/siros-hw-discard' bin/siros* fonts images lib scripts node_modules protocols
echo "... done" && echo ""
echo "creating $PACKAGE_WIN ..."
COPYFILE_DISABLE=1 zip -r ../build/$PACKAGE_WIN --exclude='bin/siros-hw-discard.cmd' bin/siros*.cmd fonts images lib scripts node_modules protocols 1>/dev/null
echo "... done" && echo ""
npm ci --no-production
