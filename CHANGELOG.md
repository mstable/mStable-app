# Changelog

## Next

Bug fixes:

- Restrict getting historic transaction logs to just before mUSD was deployed (on mainnet)

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
