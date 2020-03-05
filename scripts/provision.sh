#!/bin/bash

echo "Provisioning submodules"
git submodule update --init

echo "Installing contracts"

cd ./lib/mStable-subgraph
git submodule update --init

cd ./lib/mStable-contracts
yarn install

echo "Compiling contracts"
yarn compile
