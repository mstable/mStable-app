import { Reasons } from './types';
import { BassetState } from '../../../context/DataProvider/types';
import { humanizeList } from '../../../web3/strings';

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

    case Reasons.MustBeBelowMaxWeighting: {
      const plural = affectedBassets.length > 1;
      return `The balance${plural ? 's' : ''} of ${getBassetSymbols(
        affectedBassets,
      )} cannot be pushed past ${
        plural ? 'their' : 'its'
      } maximum limit; this limit helps to ensure diversification and reduce risk.`;
    }

    case Reasons.BasketFailed:
      return 'Basket failed';

    case Reasons.FetchingData:
      return 'Fetching data';

    case Reasons.NoAssetSelected:
      return 'No asset selected';

    case Reasons.NoAssetsSelected:
      return 'No assets selected';

    case Reasons.AmountExceedsApprovedAmount:
      return 'Amount exceeds approved amount; in order for this contract to spend your tokens, you first need to give it approval';

    case Reasons.AssetNotAllowedInMint:
      return 'Asset not allowed in mint';

    case Reasons.BasketUndergoingRecollateralisation:
      return 'Basket undergoing recollateralisation';

    default:
      throw new Error('Unexpected reason');
  }
};
