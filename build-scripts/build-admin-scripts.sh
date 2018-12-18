#!/bin/bash
set -e

# expecting to be in 'admin-scripts' directory already
npm install --production
npm prune --production
mkdir -p ../build
rm -f ../build/siros-admin-scripts*.tgz
PACKAGE_NIX="siros-admin-scripts@${npm_package_version}-nix.tgz"
PACKAGE_WIN="siros-admin-scripts@${npm_package_version}-win.zip"
echo "creating $PACKAGE_NIX ..."
COPYFILE_DISABLE=1 tar cfz ../build/$PACKAGE_NIX --exclude='bin/siros*.cmd' bin/siros* fonts images lib scripts node_modules
echo "... done" && echo ""
echo "creating $PACKAGE_WIN ..."
COPYFILE_DISABLE=1 zip -r ../build/$PACKAGE_WIN bin/siros*.cmd fonts images lib scripts node_modules 1>/dev/null
echo "... done" && echo ""
npm install --no-production
