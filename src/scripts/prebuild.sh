#!/bin/bash

# This script is used to automatically tag the latest commit with the
# current version number. It is called by the release script.

# Get the current version number
VERSION=$(git describe --tags --abbrev=0 2>&1)

if [[ $VERSION =~ ^fatal ]]; then
  VERSION=0.0.1
fi

#replace . with space so can split into an array
if [[ "$VERSION" == "" ]]; then
  echo "No version tag found. Aborting."
  exit 1
fi

VERSION_BITS=(${VERSION//./ })

#get number parts and increase last one by 1
VNUM1=${VERSION_BITS[0]}
VNUM2=${VERSION_BITS[1]}
VNUM3=${VERSION_BITS[2]}
VNUM3=$((VNUM3 + 1))

#create new tag
NEW_TAG="$VNUM1.$VNUM2.$VNUM3"

echo "Updating $VERSION to $NEW_TAG"

#get current hash and see if it already has a tag
GIT_COMMIT=$(git rev-parse HEAD)
NEEDS_TAG=$(git describe --contains $GIT_COMMIT 2>/dev/null)

#only tag if no tag already
if [ -z "$NEEDS_TAG" ]; then
  git tag $NEW_TAG
  echo "Tagged with $NEW_TAG"
  git push --tags
else
  echo "Already a tag on this commit"
fi
