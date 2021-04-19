import React, { FC, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useLocation } from 'react-use';

import { useDataState } from '../../context/DataProvider/DataProvider';
import {
  useSelectedMasset,
  useSelectedMassetName,
  useSetSelectedMassetName,
} from '../../context/SelectedMassetNameProvider';
import { ViewportWidth } from '../../theme';
import { MassetName } from '../../types';
import { Dropdown, DropdownOption } from './Dropdown';

const StyledDropdown = styled(Dropdown)`
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

  const options = useMemo<Record<string, DropdownOption>>(
    () =>
      Object.fromEntries([
        ...Object.values(dataState).map(massetState => [
          massetState.token.symbol,
          {
            symbol: massetState.token.symbol,
          },
        ]),
      ]),
    [dataState],
  );

  // Handle the masset changing directly from the URL
  const setSelectedMassetName = useSetSelectedMassetName();
  const massetName = useSelectedMassetName();
  const location = useLocation();
  useEffect(() => {
    const massetNameInUrl = location.hash?.match(/^#\/(musd|mbtc)\//)?.[1] as
      | MassetName
      | undefined;
    if (massetNameInUrl && massetNameInUrl !== massetName) {
      setSelectedMassetName(massetNameInUrl);
    }
  }, [location, massetName, setSelectedMassetName]);

  return (
    <StyledDropdown
      onChange={(selectedAddress?: string): void => {
        if (!selectedAddress) return;

        const slug = Object.keys(options)
          .find(address => address === selectedAddress)
          ?.toLowerCase() as MassetName;

        setMassetName(slug as MassetName);

        const tab = window.location.hash.split('/')[2];
        history.push(`/${slug}/${tab}`);
      }}
      options={options}
      defaultOption={dataState[selected]?.token?.symbol}
    />
  );
};
