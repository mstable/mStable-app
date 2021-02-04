import React, { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useDataState } from '../../context/DataProvider/DataProvider';
import { MassetState } from '../../context/DataProvider/types';
import { useSelectedMasset } from '../../context/SelectedMassetNameProvider';
import { MassetName } from '../../types';
import { Dropdown } from './Dropdown';

export const MassetSelector: FC = () => {
  const dataState = useDataState();
  const history = useHistory();
  const [selected, setMassetName] = useSelectedMasset();

  const massetStates = useMemo(
    () =>
      ({
        mbtc: dataState.mbtc,
        musd: dataState.musd,
      } as { [key in MassetName]: MassetState | undefined }),
    [dataState.mbtc, dataState.musd],
  );

  const options = Object.values(massetStates).map(massetState => ({
    address: massetState?.token?.address,
    symbol: massetState?.token?.symbol,
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
    <Dropdown
      onChange={handleSelect}
      options={options}
      defaultAddress={massetStates[selected]?.token?.address}
    />
  );
};
