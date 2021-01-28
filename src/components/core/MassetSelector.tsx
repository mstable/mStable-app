import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { useHistory } from 'react-router-dom';

import { useDataState } from '../../context/DataProvider/DataProvider';
import { MassetState } from '../../context/DataProvider/types';
import { useSelectedMasset } from '../../context/SelectedMassetNameProvider';
import { MassetName } from '../../types';
import { TokenIcon } from '../icons/TokenIcon';
import { UnstyledButton } from './Button';

const OptionContainer = styled(UnstyledButton)`
  background: blue;
  display: flex;
  width: 100%;
  border-radius: 0.33rem;
  background: red;
  text-align: left;
  padding: 0.25rem 0.75rem;
  align-items: center;

  &:hover {
    color: white;
    background: #4db8ff;
  }

  img {
    height: 32px;
    width: 32px;
    margin-right: 0.5rem;
  }
`;

const OptionList = styled.div`
  position: absolute;
  border-radius: 0.5rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: blue;
  min-width: 120px;
  padding: 0.5rem 0;
`;

const Container = styled.div`
  min-width: 120px;
`;

const Option: FC<{
  active?: boolean;
  onClick: () => void;
  massetState?: MassetState;
}> = ({ onClick, massetState, active = false }) => {
  if (!massetState) return null;
  const { symbol } = massetState.token;

  return (
    <OptionContainer onClick={onClick}>
      <TokenIcon symbol={symbol} />
      {symbol}
      {active && `▼`}
    </OptionContainer>
  );
};

export const MassetSelector: FC = () => {
  const dataState = useDataState();
  const history = useHistory();
  const [selected, setMassetName] = useSelectedMasset();
  const [show, setShow] = useState(false);

  const massetStates = useMemo(
    () =>
      ({
        mbtc: dataState.mbtc,
        musd: dataState.musd,
      } as { [key in MassetName]: MassetState | undefined }),
    [dataState.mbtc, dataState.musd],
  );

  const handleToggle = useCallback(() => setShow(!show), [show, setShow]);

  const handleSelect = (slug: MassetName): void => {
    setShow(false);
    setMassetName(slug as MassetName);

    const tab = window.location.hash.split('/')[2];
    history.push(`/${slug}/${tab}`);
  };

  const container = useRef(null);
  useOnClickOutside(container, () => setShow(false));

  return (
    <Container ref={container}>
      <Option
        onClick={handleToggle}
        massetState={massetStates[selected]}
        active
      />
      <OptionList hidden={!show}>
        {Object.keys(massetStates)
          .filter(m => m !== selected)
          .map(slug => (
            <Option
              key={slug}
              onClick={() => handleSelect(slug as MassetName)}
              massetState={massetStates[slug as MassetName]}
            />
          ))}
      </OptionList>
    </Container>
  );
};
