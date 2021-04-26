import { BigDecimal } from '../web3/BigDecimal'
import { BoostedSavingsVaultState } from '../context/DataProvider/types'

// Boost params (imUSD Vault)
export const MAX_BOOST_IMUSD = 3
export const MIN_BOOST_IMUSD = 1
export const COEFFICIENT_IMUSD = 6
export const EXPONENT_IMUSD = 0.875
export const PRICE_IMUSD = 0.1

export const calculateBoostImusd = (stakingBalance?: BigDecimal, vMTABalance?: BigDecimal): number => {
  const scaledBalance = (stakingBalance?.simple ?? 0) * PRICE_IMUSD
  if (vMTABalance && stakingBalance && vMTABalance.simple > 0 && stakingBalance.simple > 0) {
    const boost = MIN_BOOST_IMUSD + (COEFFICIENT_IMUSD * vMTABalance.simple) / scaledBalance ** EXPONENT_IMUSD
    return Math.min(MAX_BOOST_IMUSD, boost)
  }
  return MIN_BOOST_IMUSD
}

export const calculateVMTAForMaxBoostImusd = (stakingBalance: BigDecimal): number | undefined => {
  const scaledBalance = (stakingBalance?.simple ?? 0) * PRICE_IMUSD
  const vMTA = ((MAX_BOOST_IMUSD - MIN_BOOST_IMUSD) / COEFFICIENT_IMUSD) * scaledBalance ** EXPONENT_IMUSD
  return vMTA !== 0 ? vMTA : undefined
}

// Boost params
export const MAX_BOOST = 3
export const MIN_BOOST = 1
export const EXPONENT = 7 / 8
export const FLOOR = 1
export const VMTA_CAP = 400000
export const MIN_DEPOSIT = 1

// 100 deposit, priceCoeff = 1, 0.3 vMTA = 1x
// 100 deposit, priceCoeff = 1, 32 vMTA = 1.314x
// 1000 deposit, priceCoeff = 3, 225 vMTA = 1.929x
// 100000 deposit, priceCoeff = 0.1, 1000 vMTA = 2.468x
// 100000 deposit, priceCoeff = 1, 11000 vMTA = 3x

export const calculateVMTAForMaxBoost = (stakingBalance: BigDecimal, boostCoeff: number, priceCoeff: number): number => {
  const scaledBalance = stakingBalance.simple * priceCoeff
  const x = MAX_BOOST - FLOOR
  const y = scaledBalance ** EXPONENT
  const unbounded = (x * y) / boostCoeff
  return Math.min(unbounded, VMTA_CAP)
}

export const calculateBoost = (boostCoeff: number, priceCoeff: number, stakingBalance?: BigDecimal, vMTABalance?: BigDecimal): number => {
  const scaledBalance = (stakingBalance?.simple ?? 0) * priceCoeff
  if (vMTABalance && stakingBalance && vMTABalance.simple > 0 && scaledBalance >= MIN_DEPOSIT) {
    const unbounded = FLOOR + (boostCoeff * Math.min(vMTABalance.simple, VMTA_CAP)) / scaledBalance ** EXPONENT
    // bounded
    return Math.min(MAX_BOOST, Math.max(MIN_BOOST, unbounded))
  }
  return MIN_BOOST
}

export const getCoeffs = (vault: BoostedSavingsVaultState): [number, number] | undefined => {
  if (vault.boostCoeff && vault.priceCoeff) {
    return [vault.boostCoeff, vault.priceCoeff]
  }

  switch (vault.address) {
    // All USD
    case '0xb3114e33fc6ff5f3c452980ccbe7cf1de1fc822b': // ropsten
    case '0xd124b55f70d374f58455c8aedf308e52cf2a6207': // musd/busd
    case '0xadeedd3e5768f7882572ad91065f93ba88343c99': // musd/gusd
      return [4.8, 1]

    // All BTC
    case '0xae077412fe8c3df00393a63e49caae2658a33019': // ropsten
    case '0x760ea8cfdcc4e78d8b9ca3088ecd460246dc0731': // mbtc/tbtc
    case '0xf65d53aa6e2e4a5f4f026e73cb3e22c22d75e35c': // mbtc/hbtc
      return [4.8, 58000]

    case '0xf38522f63f40f9dd81abafd2b8efc2ec958a3016': // imbtc vault
      return [4.8, 5800]
    default:
      return undefined
  }
}
