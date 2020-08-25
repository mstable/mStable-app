# mStable App

A web frontend for interacting with the [mStable contracts](https://github.com/mstable/mStable-contracts).

---

## Setup

### Installation

1. `git clone git@github.com:mstable/mStable-app.git && cd mStable-app`
2. `cp .env.example.ropsten .env` to connect to Ropsten (or `cp .env.example.mainnet .env` to connect to Mainnet)
3. `yarn`
4. `yarn provision`
5. `yarn codegen`
6. Optional: replace env vars in `.env` with e.g. a real Infura provider key

### Running the application locally

Simply run `yarn start`.

---

### Optional: run the stack locally

The installation instructions above will connect to the deployed contracts and Subgraph on either Ropsten or Mainnet,
but it is also possible to run the whole stack locally. This should generally not be necessary.

#### Prerequisites

First, ensure that these are installed:

- [Ganache](https://www.trufflesuite.com/ganache)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Docker](https://docs.docker.com/install)

And that the the Docker daemon is running.

#### Deploying the contracts locally

Simply run `yarn truffle:migrate` and the contracts will be deployed to a
local Ganache instance on http://127.0.0.1:7545.

#### Deploying the subgraph

Firstly run `graph-node` locally:

1. Navigate to `lib/graph-node/docker`.
2. Edit `docker-compose.yml` if needed (e.g. to set the host URL for Ganache).
3. Run `docker-compose up` to start the node.

Next, create and deploy the subgraph.

1. Navigate to `lib/mStable-subgraph`.
2. Edit `subgraph.yaml` if needed to set the contract addresses to those deployed locally.
3. Run `yarn codegen`.
4. Run `yarn create-local`; the graph node should output a log.
5. Run `yarn deploy-local`; the graph node should start running the subgraph and begin processing blocks.

More detailed instructions are available [here](https://github.com/mstable/mStable-subgraph/tree/master#setup).
