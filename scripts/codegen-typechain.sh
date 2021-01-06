#!/bin/zsh

rm ./lib/abis/combined/*
find ./node_modules/@mstable/protocol/build/contracts/**/*.sol -regex '.*[^dbg\.]\.json' -exec cp {} ./lib/abis/combined/ \;
cp ./lib/abis/overrides/*.json ./lib/abis/combined
yarn typechain --target ethers-v4 --outDir src/typechain './lib/abis/combined/*.json'
