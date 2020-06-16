# Changelog

## Next


Miscellaneous:

* Round down simple numbers to the nearest decimal place
* Adjust the behaviour of `useIncreasingNumber` such that the 
number doesn't increase when under a small threshold (i.e. near-zero)
* Make failed transactions more obvious (in the wallet view)
* Fix line height for mUSD savings balance

Bug fixes:

* Fix setting the max amount for savings contract withdrawals and for redeeming
* Fix the detection of breached bAssets; the one percent of the 
total vault that forms the basis of the weight breach threshold 
should be based on the total supply of the mAsset (i.e. total of 
all vaults)
* Remove mAsset from other token balances in wallet view


## Version 1.1.0

_Released 16.06.20 17.40 CEST_

New features:

* Adjust the mint/save/redeem forms such that a simulated state is produced based on the form inputs
* Animate the basket stats graphic
* Automatically reconnect the wallet once on startup (if possible)

Refactors: 

* Create a wrapper class for `BigNumber` (`bn.js`) to support operations on big decimal numbers, mirroring functionality from `StableMath`
* Use `BigDecimal` throughout the app (except some parts of the swap form, which haven't been refactored)
* Use pipelines to reduce state actions, simulate and validate for form state
* Move 'set max' into reducers
* Consolidate all mAsset/bAssets calculations in one place, so that the state can be recalculated when the underlying data changes; this also facilitates data simulations.

Miscellaneous:

* Reset form errors when amounts are unset
* Adjust form error style

Bug fixes:

* Fix number input handling for increments


## Version 1.0.0

_Released 27.05.20 18.38 CEST_

* Initial release
