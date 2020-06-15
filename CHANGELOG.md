# Changelog

## Next

New features:

* Adjust the mint/save/redeem forms such that a simulated state is produced based on the form inputs
* Animate the basket stats graphic

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


## Version 1.0

_Released 27.05.20 18.38 CEST_

* Initial release
