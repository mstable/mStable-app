import React, { FC } from 'react';
import styled from 'styled-components';

import { formatMassetName } from '../../../../context/SelectedMassetNameProvider';
import { MassetName } from '../../../../types';

import IMUSDMTAIcon from '../../../icons/tokens/imusd-mta.svg';
import IMUSDIcon from '../../../icons/tokens/imUSD.svg';
import MUSDIcon from '../../../icons/tokens/mUSD.svg';
import IMBTCMTAIcon from '../../../icons/tokens/imbtc-mta.svg';
import IMBTCIcon from '../../../icons/tokens/imBTC.svg';
import MBTCIcon from '../../../icons/tokens/mBTC.svg';

type AssetType = 'masset' | 'imasset' | 'vault';

interface Props {
  masset: MassetName;
  type: AssetType;
}

const musdIcons: Record<AssetType, JSX.Element> = {
  masset: <MUSDIcon />,
  imasset: <IMUSDIcon />,
  vault: <IMUSDMTAIcon />,
};

const mbtcIcons: Record<AssetType, JSX.Element> = {
  masset: <MBTCIcon />,
  imasset: <IMBTCIcon />,
  vault: <IMBTCMTAIcon />,
};

const icons: Record<MassetName, Record<AssetType, JSX.Element>> = {
  musd: musdIcons,
  mbtc: mbtcIcons,
};

const getTitle = (masset: MassetName, type: AssetType): string => {
  const formattedMasset = formatMassetName(masset);
  return ({
    masset: formattedMasset,
    imasset: `i${formattedMasset}`,
    vault: `i${formattedMasset} Vault`,
  } as Record<AssetType, string>)[type];
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > svg {
    width: 2rem;
    height: auto;
  }
`;

export const SaveModalHeader: FC<Props> = ({ masset, type }) => {
  const icon = icons[masset][type];
  const title = getTitle(masset, type);

  return (
    <Container>
      {icon}
      {title}
    </Container>
  );
};
