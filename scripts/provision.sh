#!/bin/bash

echo "Provisioning submodules"
git submodule update --init

echo "Installing contracts"

cd ./lib/mStable-subgraph
yarn run provision
