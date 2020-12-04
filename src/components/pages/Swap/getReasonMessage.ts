import { Reasons } from './types';
import { BassetState, MassetState } from '../../../context/DataProvider/types';

export const getReasonMessage = (
  reason: Reasons | undefined,
  affectedAsset?: BassetState | MassetState,
): string | undefined => {
  switch (reason) {
    case undefined:
      return undefined;
    case Reasons.AssetNotAllowedInMint:
      return 'Asset not allowed in mint';

    case Reasons.AssetNotAllowedInSwap:
      return 'Asset not allowed in swap';

    case Reasons.TransferMustBeApproved:
      return 'Transfer must be approved';

    case Reasons.AmountExceedsBalance:
      return 'Amount exceeds balance';

    case Reasons.AmountMustBeGreaterThanZero:
      return 'Amount must be greater than zero';

    case Reasons.AmountMustBeSet:
      return 'Amount must be set';

    case Reasons.AssetsMustRemainBelowMaxWeight:
      return `${affectedAsset?.token.symbol ||
        'Asset'} must remain below its maximum weight; this limit helps to ensure diversification and reduce risk. Try using another asset.`;

    case Reasons.CannotRedeemMoreAssetsThanAreInTheVault:
      return `Cannot redeem more assets than are in the vault${
        affectedAsset &&
        (affectedAsset as BassetState | undefined)?.totalVaultInMasset
          ? ` (${
              affectedAsset.token.symbol
            }: ${(affectedAsset as BassetState).totalVaultInMasset.format()})`
          : ''
      }`;

    case Reasons.FetchingData:
      return 'Fetching data';

    case Reasons.AssetMustBeSelected:
      return 'Asset must be selected';

    default:
      throw new Error('Unexpected reason');
  }
};
