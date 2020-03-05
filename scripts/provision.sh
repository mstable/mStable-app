#!/bin/bash

echo "Provisioning submodules"
git submodule update --init

echo "Installing subgraph"
cd ./lib/mStable-subgraph
yarn install
yarn provision
