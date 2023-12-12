#!/bin/sh

echo "Current Work Dir:"
echo $PWD

# Install CocoaPods and yarn using Homebrew.
brew install cocoapods
# have to add node yourself
brew install node@16
# link it to the path
brew link node@16
brew install yarn

# Install dependencies
cd ../..
yarn
cd ios
pod install
cd ci_scripts
