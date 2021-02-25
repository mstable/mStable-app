import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useDataState } from '../../context/DataProvider/DataProvider';
import { useSelectedMasset } from '../../context/SelectedMassetNameProvider';
import { ViewportWidth } from '../../theme';
import { MassetName } from '../../types';
import { AssetDropdown } from './AssetDropdown';

const StyledDropdown = styled(AssetDropdown)`
  @media (max-width: ${ViewportWidth.m}) {
    min-width: 5.5rem;

    > button > div {
      display: none;
    }
    > div {
      min-width: 5.5rem;
      > button > div {
        display: none;
      }
    }
  }
`;

export const MassetSelector: FC = () => {
  const dataState = useDataState();
  const history = useHistory();
  const [selected, setMassetName] = useSelectedMasset();

  const options = Object.values(dataState).map(massetState => ({
    address: massetState.token.address,
    symbol: massetState.token.symbol,
  }));

  const handleSelect = (selectedAddress?: string): void => {
    if (!selectedAddress) return;

    const slug = options
      .find(({ address }) => address === selectedAddress)
      ?.symbol?.toLowerCase() as MassetName;

    setMassetName(slug as MassetName);

    const tab = window.location.hash.split('/')[2];
    history.push(`/${slug}/${tab}`);
  };

  return (
    <StyledDropdown
      onChange={handleSelect}
      options={options}
      defaultAddress={dataState[selected]?.token?.address}
    />
  );
};
