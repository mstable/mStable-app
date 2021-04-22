import { Dispatch, SetStateAction } from 'react'
import { createStateContext } from 'react-use'

import { MassetName } from '../types'
import { MASSETS } from '../constants'

export const formatMassetName = (masset: MassetName): string =>
  (({
    musd: 'mUSD',
    mbtc: 'mBTC',
  } as Record<MassetName, string>)[masset])

const defaultValue: MassetName = (() => {
  const slugs = Object.keys(MASSETS)
  const slug = window.location.hash.split('/')[1]

  return slug && slugs.includes(slug) ? (slug as MassetName) : 'musd'
})()

const [useSelectedMassetNameCtx, SelectedMassetNameProvider] = createStateContext<MassetName>(defaultValue)

export const useSelectedMasset = (): [MassetName, Dispatch<SetStateAction<MassetName>>] => useSelectedMassetNameCtx()

export const useSelectedMassetName = (): MassetName => useSelectedMassetNameCtx()[0]

export const useSetSelectedMassetName = (): Dispatch<SetStateAction<MassetName>> => useSelectedMassetNameCtx()[1]

export { SelectedMassetNameProvider }
