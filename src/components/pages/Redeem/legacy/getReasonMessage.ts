import { Reasons } from './types';
import { BassetState } from '../../../../context/DataProvider/types';
import { humanizeList } from '../../../../utils/strings';

const getBassetSymbols = (bAssets: BassetState[]): string =>
  humanizeList(bAssets.map(b => b.token.symbol));

export const getReasonMessage = (
  reason: Reasons | undefined,
  affectedBassets: BassetState[] = [],
): string | undefined => {
  switch (reason) {
    case undefined:
      return undefined;

    case Reasons.AmountExceedsBalance:
      return 'Amount exceeds balance';

    case Reasons.AmountMustBeGreaterThanZero:
      return 'Amount must be greater than zero';

    case Reasons.AmountMustBeSet:
      return 'Amount must be set';

    case Reasons.AssetsMustRemainBelowMaxWeight: {
      const plural = affectedBassets.length > 1;
      return `Redeeming would cause ${getBassetSymbols(
        affectedBassets,
      )} to exceed ${
        plural ? 'their' : 'its'
      } maximum limit; this limit helps to ensure diversification and reduce risk. Try redeeming with all assets.`;
    }

    case Reasons.BasketContainsBlacklistedAsset:
      return `Basket contains blacklisted assets: ${getBassetSymbols(
        affectedBassets,
      )}`;

    case Reasons.CannotRedeemMoreAssetsThanAreInTheVault:
      return `Cannot redeem more assets than are in the vault (${affectedBassets.map(
        b => `${b.token.symbol}: ${b.totalVaultInMasset.format()}`,
      )})`;

    case Reasons.FetchingData:
      return 'Fetching data';

    case Reasons.MustRedeemOverweightAssets:
      return `The balances of ${getBassetSymbols(
        affectedBassets,
      )} are currently at their maximum limit; this limit helps to ensure diversification and reduce risk. Try redeeming with all assets.`;

    case Reasons.MustRedeemWithAllAssets:
      return 'Must redeem with all assets';

    case Reasons.NoAssetSelected:
      return 'No asset selected';

    case Reasons.NoAssetsSelected:
      return 'No assets selected';

    case Reasons.NothingInTheBasketToRedeem:
      return 'Nothing in the basket to redeem';

    case Reasons.RedemptionPausedDuringRecol:
      return 'Redemption is paused during recollateralisation';

    default:
      throw new Error('Unexpected reason');
  }
};
