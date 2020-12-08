# mStable App

A web frontend for interacting with the [mStable contracts](https://github.com/mstable/mStable-contracts).

---

## Setup

### Installation

1. `git clone git@github.com:mstable/mStable-app.git && cd mStable-app`
2. `cp .env.example.ropsten .env` to connect to Ropsten (or `cp .env.example.mainnet .env` to connect to Mainnet)
3. `yarn`
5. `yarn codegen`
6. Optional: replace env vars in `.env` with e.g. a real Infura provider key

### Running the application locally

Simply run `yarn start`.

