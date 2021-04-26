import React from 'react'
import { BannerMessage } from '../../context/AppProvider'
import { formatMassetName } from '../../context/SelectedMassetNameProvider'
import { MassetName } from '../../types'
import { BigDecimal } from '../../web3/BigDecimal'
import { ExternalLink } from '../core/ExternalLink'

interface Props {
  saveV2: ({ hasV1Balance, pathname }: { hasV1Balance: boolean; pathname: string }) => BannerMessage | undefined
  recollat: ({ massetName }: { massetName: MassetName }) => BannerMessage | undefined
  tvlCap: ({ tvlCap }: { tvlCap?: BigDecimal }) => BannerMessage | undefined
  polygon: () => BannerMessage | undefined
}

export const MessageHandler: Props = {
  saveV2: ({ hasV1Balance, pathname }) => ({
    emoji: '🚀',
    title: 'SAVE V2 has launched!',
    subtitle: hasV1Balance ? 'Migrate your funds now to keep earning interest.' : undefined,
    url: pathname !== '/musd/save' ? '/musd/save' : undefined,
  }),
  recollat: ({ massetName }) => {
    const formattedMasset = formatMassetName(massetName)
    return {
      title: `${formattedMasset} is currently undergoing recollateralisation. `,
      subtitle: `During this time,
    mAsset functionality will be reduced in order to restore a healthy
    basket state.`,
      emoji: '⚠️',
    }
  },
  tvlCap: ({ tvlCap }) =>
    tvlCap && {
      title: `Current TVL cap is ${tvlCap.format(4, false)} mBTC. `,
      emoji: '⚠️',
      url: 'https://medium.com/mstable/mstable-launches-mbtc-e26a246dc0bb',
    },
  polygon: () => ({
    title: 'Using mStable:',
    subtitle: (
      <>
        Bridge bAssets USDC, DAI or USDT via the <ExternalLink href="https://wallet.matic.network/bridge/">Matic Bridge</ExternalLink>.
        <p> Note - the ability to bridge mUSD cross chain is coming soon, until then, please only use bridged bAssets.</p>
      </>
    ),
    emoji: '⚠️',
  }),
}
