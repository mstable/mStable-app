# Changelog

## Next

## Version 1.15.0

- Add a gas prices widget to allow the user to select a gas price and see the transaction fee
- Add balance to asset dropdown in SWAP

## Version 1.14.0

- Implement Onboard.js for connecting wallets; this supports more wallet types
  and reduces complexity of the UI

## Version 1.13.0

Features:

- Add support for the Curve mUSD pool in EARN
- Add "+Yield" and "+CRV" to pools where appropriate

Bug fixes:

- Handle all errors from the Graph and avoid spamming error notifications

## Version 1.12.3

Features:

- Add support for Meet.one wallet

## Version 1.12.2

Miscellaneous:

- Updated Protip in Redeem with Curve Finance link

## Version 1.12.1

Bug fixes:

- Ensure APY values align on chart by starting from the start of 7 days ago, at the start of the day,
  and aligning values to the start of the day

## Version 1.12.0

Features:

- Add support for running the dApp on IPFS

Miscellaneous:

- Add script to calculate fees collected for mUSD
- Removed beta warning from intro and header

## Version 1.11.1

Features:

- Savings balance value now increases only when interest accrues, rather than a conservative
  (but notional) increase in real time

Miscellaneous:

- Added Kovan and Ropsten testnet deployments for testing purposes

## Version 1.11.0

_Released 04.09.20 15.00 CEST_

Features:

- Support withdrawing a partial stake from EARN pools

Miscellaneous:

- Remove redundant information about BAL rewards for claim and withdraw confirmations
- Use closest APY data-points for daily APY chart for each day (i.e. ensure the x-axis lines up)

## Version 1.10.0

_Released 04.09.20 15.00 CEST_

Features:

- Add Claim button to claim rewards (over multiple weeks in one transaction) with
  Merkle Drop contracts

Scripts:

- Add script to calculate and output reports for platform rewards earned via staking
- Add script to create Merkle root hashes for Merkle Drop contracts
- Add script to output bAsset vault balances over time
- Output rewards report for week 0

Miscellaneous:

- Minor CSS fixes
- Better align daily APYs on x-axis of graph
- Reduce price request volume with Coingecko

## Version 1.9.3

_Released 03.09.20 21.05 CEST_

Bug fixes:

- Fix an issue where The Graph data did not appear

Miscellaneous:

- Visually separate expired pools from current pools, and rewards information
  associated with expired pools.
- Disable the stake form for expired pools, and instruct users to instead
  exit the pool.

## Version 1.9.2

_Released 20.08.20 19.02 CEST_

Bug fixes:

- Show that BAL rewards will be received for the Balancer MTA/mUSD 95/5 pool

Miscellaneous:

- Make the inputs for redeeming with specific assets clearer, and add a
  note explaining that assets to redeem must be selected and amounts entered.

## Version 1.9.1

_Released 17.08.20 16.04 CEST_

Bug fixes:

- Show 'No data yet' for the APY of new EARN pools (<24h)
- Hide the stake/claim/exit forms when viewing a pool as another address
- Redirect back from a user's shared pool page when clicking 'reset'
- Analytics: Ensure y-axis numbers are not cut off on smaller viewports,
  and use tabs for the date ranges

## Version 1.9.0

_Released 17.08.20 13.44 CEST_

Features:

- Add support for redeeming with a custom selection of bAssets, so that users
  can redeem with a single bAsset, a selection of bAssets, or all bAssets
  (proportional redemption).
- Show how redemptions affect mUSD and its basket of assets.

Bug fixes:

- Limit historic transactions fetching (via `eth_getLogs`) to 1000 blocks back,
  so that all providers should be able to fetch the logs without being limited.

## Version 1.8.8

_Released 17.08.20 12.30 CEST_

Miscellaneous:

- Update the BAL rewards message

## Version 1.8.7

_Released 14.08.20 12.13 CEST_

Bug fixes:

- Fix a bug where the token approval button did not appear in the swap form.

## Version 1.8.6

_Released 12.08.20 19.28 CEST_

Miscellaneous:

- Adjust the behaviour of the redemption form such that when the
  'redeem with all assets' toggle is selected, it is still possible
  to toggle a bAsset to select it for single redemption.
- Add headers to each main page to better explain what each page is for
- Make the transition when opening/closing the account view easier to
  see, and add a prominent 'back to app' button on the account view.
- Add temporary message about BAL rewards airdropping to Balancer pools.

## Version 1.8.5

_Released 10.08.20 18.14 CEST_

Features:

- Provide a button for users to share a link to view their balances in a given pool
- Provide a simple form on the pool view to input an address and view that user's balances
- When a new version of the app is available (according to Github releases), add a
  notification (that can be dismissed) with a button to refresh the page
- Add EARN content to the FAQ

Miscellaneous:

- Replace outdated EARN screenshots with small videos
- Make EARN tabs and active nav items more obvious

Bug fixes:

- Handle edge cases with non-numbers for counters
- Before attempting to eagerly connect a previously-connected MetaMask account,
  ensure that MetaMask is unlocked
- Improve localStorage error handling
- Handle empty transaction error messages

## Version 1.8.4

_Released 06.08.20 14.29 CEST_

Bug fixes:

- Adjust parsing and presentation of decimals for some browsers
- Add extra pool balance decimals
- Add extra decimals for pool shares and staked token balances (8 decimals total)

Miscellaneous:

- Increase font size of submit buttons
- Add impermanent loss warning to pools that contain non-stablecoin collateral

## Version 1.8.3

_Released 05.08.20 12.38 CEST_

Bug fixes:

- When navigating to a pool from the pools overview, scroll to the top
- Add handling for a transfer approval edge case with USDT in which the approved
  amount must first be reset to zero before setting a new approved amount.

## Version 1.8.2

_Released 05.08.20 09.09 CEST_

Bug fixes:

- Ensure EARN APYs are available on first load
- Link to the staking token on Etherscan on the pool card
- Fix beta warning style
- Ensure selecting 'max' when withdrawing mUSD savings uses the full amount in credits

## Version 1.8.1

_Released 04.08.20 16.07 CEST_

Bug fixes:

- Fix EARN APY calculations and start with a narrow window for the preceding readings (16 hours previous)
- Fix staking token price calculation
- Add more decimal places to staking balance percentage

Miscellaneous:

- Adjust behaviour of approve button such that it is possible to either approve the
  exact amount or an infinite amount
- Normalise button sizes throughout the app
- Improve the approval error message
- Various small UI fixes

## Version 1.8.0

_Released 03.08.20 15.30 CEST_

Features:

- Add EARN feature
  - This is a major change and includes new data sources and data
    processing, new contracts, a new top-level navigation item,
    and various components and forms.
  - Update `mStable-subgraph` submodule
  - Add another localStorage version
- App header/navigation updates
  - Use the connected wallet icon instead of the connected address blockie
  - Show transaction status success/pending/error icon by wallet
  - Add notifications section
  - Improve layout for navigation items
- Token approvals
  - Improve the token spending allowance UX with an amount field and infinite approve button

Miscellaneous:

- Add multiple Subgraph endpoints, to use data from connected
  projects (Balancer, Uniswap) and block timestamps.
- Improve GraphQL code generation
- Add more token icons
- Improve abstractions for common tasks (tokens, amounts, allowances, etc)
- Reduce query volume for fetching data, particularly token balances/allowances
- Add easter egg

## Version 1.7.0

_Released 23.07.20 16.00 CEST_

Miscellaneous:

- Add environment variables for various services
- Add redemption fee for proportional redemptions

## Version 1.6.0

_Released 06.07.20 19.30 CEST_

Features:

- Detect when the page is idle and avoid making new requests until the page is
  active again, and also provide visual feedback that the app is paused.

Bug fixes:

- Ensure the 'network changed' event listener is not added for injected providers that
  aren't event listeners.
- Ensure the Apollo cache is purged when the app version is changed or the app is
  being run on a different chain.

## Version 1.5.2

_Released 06.07.20 15.43 CEST_

Bug fixes:

- Restrict getting historic transaction logs to just before mUSD was deployed (on mainnet)
- Ensure that local transactions state is reset when changing account, or the activated account
  changes, or the account is disconnected

Miscellaneous:

- Add support for Sentry.io error tracking service

## Version 1.5.1

_Released 03.07.20 17.35 CEST_

Miscellaneous:

- Improve and clarify UX for redeeming with a single asset when
  assets are overweight
- Improve and clarify UX for swapping and minting when assets are overweight
  or their vault balances are exceeded

## Version 1.5.0

_Released 03.07.20 13.56 CEST_

Features:

- Enable WalletConnect and WalletLink wallets

Bug fixes:

- Use Multi-collateral DAI logo
- Fix number abbreviation for charts

Miscellaneous:

- Add footer social icons
- Add Brave button to wallet connectors
- Add migration for localStorage
- Reduce wallet icon size
- Identify and disable Dapper wallet (currently incompatible
  with `use-wallet` / `web3-react`)
- Parse failing transaction errors to provide a more useful message
- Default to 30 days for totals chart
- Improve presentation of chart labels on different viewports
- Fix order of volumes to match toggles
- Clear the recently used wallet from local storage after disconnecting (so that
  users are not automatically reconnected on the next page load with the
  previous wallet type)
- Upgrade `use-wallet`
- Remove `use-wallet` types (now in the package itself)
- Add `REACT_APP_RPC_URL` env var for connectors that need it
- Add release link to footer
- Add Github star button to footer

## Version 1.4.0

_Released 26.06.20 17.26 CEST_

Features:

- Improve validation messages for mint and redeem to clarify which actions
  are currently possible (and why)
- Standardise and simplify the language in validation messages and UI elements
- Add tooltips

Bug fixes:

- Fix footer layout on smaller viewports
- Fix y-axis for aggregate chart
- Fix swap vault balance validation

Miscellaneous:

- Change fetch policy for analytics data (first retrieve from cache, then network)
- Capped APY chart values to avoid confusion

## Version 1.3.0

_Released 25.06.20 12.18 CEST_

Features:

- Add an analytics page, with various interactive charts and other metrics
- Move various stats and charts to the analytics page, and prominently link to it

Miscellaneous:

- Add a Victory Charts theme (so that charts have a similar style)
- Add caching for Apollo data

## Version 1.2.0

_Released 23.06.20 12.06 CEST_

New Features

- Removes concept of 'breached' bAssets. Basket assets within 1% of their max weighting can now
  be redeemed, with the 'Swap fee' applied

Bug fixes:

- Ensure that clicking on the input of an overweight (i.e. disabled) bAsset when minting
  does not enable the bAsset
- Shows `amountMinusFee` in the Redeem BassetOutput instead of `amount`
- Ensure that token balances and allowances are fetched as soon as they are available
- Add `purpose` to `finalize` callback for transactions such that the callback has the
  correct dependencies

## Version 1.1.3

_Released 22.06.20 12.48 CEST_

Bug fixes:

- Ensure that overweight bAssets can be redeemed single, so long as doing so does not push
  other bAssets past their weights
- Clarify the redeem validation; output validation checks the simulated state, after
  the change
- Ensure that the overweight bAssets check overrides the breached bAssets check (i.e. so that
  `redeemMasset` is only enforced for breached bAssets when there are no overweight bAssets)
- Check that vault balances are not exceeded for a redemption against the current state of
  the basket, and with the bAsset units
- Ensure the swap fee is updated when selecting a different token in the swap form
- Fix rounding of formatted BigDecimals

Miscellaneous:

- Always show token symbols with balances under inputs
- Show the 'low fee' item when there is a fee
- Show 'asset overweight' on redeem bAsset outputs when the bAsset is overweight
- Do not use simulation for redeem stats

## Version 1.1.2

_Released 19.06.20 17.30 CEST_

Fixing a regression introduced in the 1.1.0 refactor

Bug fixes:

- Fix withdrawing whole numbers from SAVE by adding an extra credit (previously, when redeeming
  100 mUSD, it would actually redeem 99.9999999999999)

## Version 1.1.1

_Released 17.06.20 11.34 CEST_

Miscellaneous:

- Round down simple numbers to the nearest decimal place
- Adjust the behaviour of `useIncreasingNumber` such that the
  number doesn't increase when under a small threshold (i.e. near-zero)
- Make failed transactions more obvious (in the wallet view)
- Fix line height for mUSD savings balance

Bug fixes:

- Fix setting the max amount for savings contract withdrawals and for redeeming
- Fix the detection of breached bAssets; the one percent of the
  total vault that forms the basis of the weight breach threshold
  should be based on the total supply of the mAsset (i.e. total of
  all vaults)
- Remove mAsset from other token balances in wallet view

## Version 1.1.0

_Released 16.06.20 17.40 CEST_

New features:

- Adjust the mint/save/redeem forms such that a simulated state is produced based on the form inputs
- Animate the basket stats graphic
- Automatically reconnect the wallet once on startup (if possible)

Refactors:

- Create a wrapper class for `BigNumber` (`bn.js`) to support operations on big decimal numbers, mirroring functionality from `StableMath`
- Use `BigDecimal` throughout the app (except some parts of the swap form, which haven't been refactored)
- Use pipelines to reduce state actions, simulate and validate for form state
- Move 'set max' into reducers
- Consolidate all mAsset/bAssets calculations in one place, so that the state can be recalculated when the underlying data changes; this also facilitates data simulations.

Miscellaneous:

- Reset form errors when amounts are unset
- Adjust form error style

Bug fixes:

- Fix number input handling for increments

## Version 1.0.0

_Released 27.05.20 18.38 CEST_

- Initial release
