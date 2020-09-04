#!/bin/bash

echo "Provisioning submodules"
git submodule update --init

echo "Installing contracts"

cd ./lib/mStable-subgraph
yarn
yarn run prepare:staging
mkdir abis
yarn run codegen
