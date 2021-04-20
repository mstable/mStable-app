import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';

enum Network {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
}

const StyledDropdown = styled(Dropdown)`
  * {
    font-size: 1rem;
  }
`;

const options = {
  [Network.Ethereum]: {
    symbol: 'Ethereum',
  },
  [Network.Polygon]: {
    symbol: 'Polygon',
  },
};

export const NetworkDropdown: FC = () => {
  const [selected, setSelected] = useState<string | undefined>(
    Network.Ethereum,
  );

  const handleSelect = (selectedTitle?: string): void => {
    if (!selectedTitle) return;
    setSelected(selectedTitle);
  };

  return (
    <StyledDropdown
      onChange={handleSelect}
      options={options}
      defaultOption={selected}
    />
  );
};
