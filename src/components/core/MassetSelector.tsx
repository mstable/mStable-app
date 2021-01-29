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
import { ReactComponent as ChevronIcon } from '../icons/chevron-down.svg';

const Arrow = styled.span<{ selected?: boolean; active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  opacity: ${({ selected }) => (selected ? 1 : 0)};

  svg {
    height: 8px;
    width: auto;
    margin-left: 0.5rem;
    transform: ${({ active }) => (active ? `rotate(180deg)` : `auto`)};
    transition: 0.1s ease-out transform;

    path {
      fill: ${({ theme }) => theme.color.body};
    }
  }
`;

const OptionContainer = styled(UnstyledButton)<{
  active?: boolean;
  selected?: boolean;
}>`
  display: flex;
  width: 100%;
  background: ${({ theme, selected, active }) =>
    selected && active ? `${theme.color.accent}` : `none`};
  text-align: left;
  padding: 0.25rem 0.5rem;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  align-items: center;

  border-top-left-radius: ${({ active, selected }) =>
    active ? `0.75rem` : !selected ? 0 : `0.75rem`};
  border-top-right-radius: ${({ active, selected }) =>
    active ? `0.75rem` : !selected ? 0 : `0.75rem`};
  border-bottom-left-radius: ${({ active, selected }) =>
    active ? 0 : !selected ? 0 : `0.75rem`};
  border-bottom-right-radius: ${({ active, selected }) =>
    active ? 0 : !selected ? 0 : `0.75rem`};

  &:hover {
    color: ${({ theme }) => theme.color.body};
    background: ${({ theme }) => theme.color.accent};
  }

  > * {
    margin-right: 0.5rem;
  }

  img {
    height: 32px;
    width: 32px;
  }
`;

const OptionList = styled.div`
  position: absolute;
  border-radius: 0.75rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: ${({ theme }) => theme.color.background};
  padding: 0.5rem 0;
  margin-top: -1px;
  border: 1px solid ${({ theme }) => theme.color.accent};
  min-width: 9.5rem;
`;

const Container = styled.div`
  position: relative;
  min-width: 9.5rem;
`;

const Option: FC<{
  selected?: boolean;
  active?: boolean;
  onClick: () => void;
  massetState?: MassetState;
}> = ({ onClick, massetState, selected = false, active = false }) => {
  if (!massetState) return null;
  const { symbol } = massetState.token;

  return (
    <OptionContainer onClick={onClick} active={active} selected={selected}>
      <TokenIcon symbol={symbol} />
      <span>{symbol}</span>
      <Arrow selected={selected} active={active}>
        <ChevronIcon />
      </Arrow>
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
        selected
        active={show}
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
