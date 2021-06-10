import React from 'react'

import { BannerMessage } from '../../context/AppProvider'
import { ExternalLink } from '../core/ExternalLink'
import { MassetConfig } from '../../context/MassetProvider'

interface Props {
  recollat(massetConfig: MassetConfig): BannerMessage
  polygon(): BannerMessage
}

export const MessageHandler: Props = {
  recollat: (massetConfig: MassetConfig) => {
    return {
      title: `${massetConfig.formattedName} is currently undergoing recollateralisation. `,
      subtitle: `During this time,
    mAsset functionality will be reduced in order to restore a healthy
    basket state.`,
      emoji: '⚠️',
    }
  },
  polygon: () => ({
    title: 'mStable on Polygon',
    subtitle: (
      <div>
        Bridge bAssets USDC, DAI or USDT via the <ExternalLink href="https://wallet.matic.network/bridge/">Matic Bridge</ExternalLink>.
      </div>
    ),
    emoji: '⚠️',
  }),
}
