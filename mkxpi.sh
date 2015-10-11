#!/bin/bash
# Creates a XPI from the files in $SRC_DIR.
# Dependencies: bash, rm, sed, grep, 7zip

shopt -s extglob

NAME="AndroidTextReflow"
SRC_DIR="src"
VERSION=$(grep em:version "$SRC_DIR"/install.rdf | sed -e 's/<[^>]*>//g')
VERSION=${VERSION// /} # trim whitespace

echo VERSION $VERSION

# remove old xpi if it exists
if [ -f "$NAME-$VERSION.xpi" ]
then
    rm -vf "$NAME-$VERSION.xpi"
fi

# create new xpi
if [ -d "$SRC_DIR" ]
then
    pushd $SRC_DIR
    zip -r ../"$NAME-$VERSION.xpi" * -x "*~"
    popd
else
    echo "$SRC_DIR not found, exiting."
fi

